import * as moment from "moment";
import { getCustomRepository } from "typeorm";
import { Store } from "../entity";
import { CasesRepository, IItemCase, ItemRepository, StoreRepository } from "../repository";
import * as Util from "../utils/service";

export interface IDetailStore {
    cademsmart_porcentaje: number;
    venta_perdida: number;
    detail: IDetailItems[];
}

interface IDetailItems {
    categoria: string;
    casos: number;
    venta_perdida: number;
    acciones: Array<{ accion: string; monto: number }>;
}

export class StoreService {

    private today: string;

    constructor() {
        this.today = moment().format("YYYY-MM-DD");
    }

    public async groupStore(folio: number): Promise<IDetailStore | null> {
        const [ detailItems, detailStore, gestionado ] = await Promise.all([
            getCustomRepository(ItemRepository).findByStoreId(folio),
            getCustomRepository(StoreRepository).findByStoreId(folio),
            getCustomRepository(CasesRepository).totalCasesByDate(folio, this.today),
        ]);
        if (detailStore) {
            const groupDetail = {
                cademsmart_porcentaje: detailStore.osa,
                detail: this.groupDetailItem(detailItems),
                venta_perdida: detailStore.ventaPerdida,
                gestionado,
            };
            return groupDetail;
        } else {
            return null;
        }
    }

    public async listStoreUser(user: string): Promise<Store[]> {
        const ListStore = await getCustomRepository(StoreRepository).listStoreUser(user);
        return ListStore.length ? getCustomRepository(StoreRepository).dataStore(ListStore, user)
            .then((List) => {
                return List.map((store) => {
                    store.latitud = parseFloat(store.latitud);
                    store.longitud = parseFloat(store.longitud);
                    store.visita_en_progreso = Number(store.visita_en_progreso);
                    store.hasPoll = Number(store.hasPoll);
                    return store;
                });
            }) : [];
    }

    private groupDetailItem(detailItems: IItemCase[]): IDetailItems[] {
        return Util.uniqBy(detailItems, "category").map((category) => {
            const detailByCategory = detailItems.filter((item) => item.category === category);
            const accionesByCategory = Util.uniqBy(detailByCategory, "accion").filter((accion) => accion);
            const detail = {
                acciones: accionesByCategory.map((accion) => {
                    const acciones = detailByCategory.filter((d) => d.accion === accion);
                    return {
                        accion,
                        gestionado: Util.sumBy(acciones, "gestionado"),
                        casos_gestionados: acciones.filter((item) => item.gestionado > 0).length,
                        cantidad: acciones.length,
                        monto: Util.sumBy(acciones, "venta_perdida"),
                    };
                }),
                casos: detailByCategory.length,
                categoria: category,
                casos_gestionados: detailByCategory.filter((item) => item.gestionado > 0).length,
                gestionado: Util.sumBy(detailByCategory, "gestionado"),
                venta_perdida: Util.sumBy(detailByCategory, "venta_perdida"),
            };
            return detail;
        }).sort((a, b) => {
            a.acciones.sort((x, y) => y.monto - x.monto);
            return b.venta_perdida - a.venta_perdida;
        });
    }

}
