import * as moment from "moment";
import { getConnection } from "typeorm";
import { Store } from "../entity";
import {
  CasesRepository,
  ItemRepository,
  StoreRepository,
} from "../repository";
import * as Util from "../utils/service";
import * as B2B_SERVICE from "./external/B2B";

export class StoreService {
  private today: string;

  constructor() {
    this.today = moment().format("YYYY-MM-DD");
  }

  public async groupStore(
    client: string,
    folio: number,
    version: number,
  ): Promise<IDetailStore | null> {
    const [detailItems, detailStore, gestionado] = await Promise.all([
      getConnection(client)
        .getCustomRepository(ItemRepository)
        .findByStoreId(folio, this.today),
      getConnection(client)
        .getCustomRepository(StoreRepository)
        .findByStoreId(folio),
      getConnection(client)
        .getCustomRepository(CasesRepository)
        .totalCasesByDate(folio, this.today),
    ]);
    if (detailStore) {
      const groupDetail = {
        cademsmart_porcentaje: detailStore.osa,
        detail: this.groupDetailItem(detailItems, version),
        venta_perdida: detailStore.ventaPerdida,
        gestionado,
      };
      return groupDetail;
    } else {
      return null;
    }
  }

  public async listStoreUser(client: string, user: string): Promise<any> {
    const ListStore = await getConnection(client)
      .getCustomRepository(StoreRepository)
      .listStoreUser(user);

    if (ListStore.length) {
      return getConnection(client)
        .getCustomRepository(StoreRepository)
        .dataStore(ListStore, user)
        .then(async (List) => {
          const codLocales = List.map((store) => {
            return `"${store.cod_local}"`;
          });

          console.time("listVentaValor");

          const listVentaValor = await B2B_SERVICE.getVentaValor(
            client,
            codLocales,
          );

          console.timeEnd("listVentaValor");

          return List.map((store) => {
            store.latitud = parseFloat(store.latitud);
            store.longitud = parseFloat(store.longitud);
            store.visita_en_progreso = Number(store.visita_en_progreso);
            store.hasPoll = Number(store.hasPoll);

            const temp = listVentaValor.find((venta) => {
              return (
                venta.cod_local === store.cod_local &&
                venta.retail === store.cadena
              );
            });

            temp === undefined ? -1 : parseInt(temp.venta_valor);

            // store.venta_valor =
            //   store.venta_valor === undefined || store.venta_valor === null
            //     ? -1
            //     : parseInt(store.venta_valor);

            return store;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return [];
    }
  }

  private groupDetailItem(
    detailItems: IItemCase[],
    version: Number,
  ): IDetailItems[] {
    return Util.uniqBy(detailItems, "category")
      .map((category) => {
        const detailByCategory = detailItems.filter(
          (item) => item.category === category,
        );
        const accionesByCategory = Util.uniqBy(
          detailByCategory,
          "accion",
        ).filter((accion) => accion);
        const detail = {
          acciones: accionesByCategory.map((accion) => {
            const acciones = detailByCategory.filter(
              (d) => d.accion === accion,
            );
            return {
              accion:
                version == 2
                  ? accion
                  : accion == "Revisar"
                  ? "Reponer"
                  : accion,
              gestionado: Util.sumBy(acciones, "gestionado"),
              casos_gestionados: acciones.filter((item) => item.gestionado > 0)
                .length,
              cantidad: acciones.length,
              monto: Util.sumBy(acciones, "venta_perdida"),
            };
          }),
          casos: detailByCategory.length,
          categoria: category,
          casos_gestionados: detailByCategory.filter(
            (item) => item.gestionado > 0,
          ).length,
          gestionado: Util.sumBy(detailByCategory, "gestionado"),
          venta_perdida: Util.sumBy(detailByCategory, "venta_perdida"),
        };
        return detail;
      })
      .sort((a, b) => {
        a.acciones.sort((x, y) => y.monto - x.monto);
        return b.venta_perdida - a.venta_perdida;
      });
  }
}
