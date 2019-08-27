import { CronJob } from "cron";
import * as moment from "moment";
import { getConnection } from "typeorm";
import { Connection, B2B } from "../config/database";
import { Store, Summary } from "../entity";
import { ItemRepository, StoreRepository } from "../repository";
import { ItemService } from "../services";
import * as B2B_SERVICE from "../services/external/B2B";
import { summary } from "../services/external/B2B";
import * as MASTER_SERVICE from "../services/external/Master";
import { findStores } from "../services/external/Master";
import * as SUPI_SERVICE from "../services/external/SUPI";
import * as Util from "../utils/service";

// CronJobs
export const StoreSchedulerICB = new CronJob("30 */1 * * * *", async () => {
    await syncStoreB2B("icb");
}, null, null, "America/Santiago");

export const StoreSchedulerPERNOD = new CronJob("00 */1 * * * *", async () => {
    await syncStoreB2B("pernod");
}, null, null, "America/Santiago");

const itemService = new ItemService();
let folios: string[] = [];

export async function syncStoreB2B(client: string): Promise<void> {
    await Connection;
    const retail = await B2B_SERVICE.getGeneralPending(client);
    if (retail) {
        console.log("SINCRONIZANDO", retail);
        await B2B_SERVICE.startSyncGeneral(client, retail);
        folios = await getConnection(client).getCustomRepository(StoreRepository).listStore();
        const ListStore = await B2B_SERVICE.lastStoreByDate(client);
        for (const chunk of Util.chunk(ListStore, 100)) {
            await Promise.all(chunk.map((store) => storeProcess(client, store)));
        }
        await summaryProcess(client);
        await B2B_SERVICE.resetGeneralPending(client, retail);
        await B2B_SERVICE.stopSyncGeneral(client, retail);
    }
}

async function storeProcess(client: string, store: B2B_SERVICE.ILastStoreByDate): Promise<void> {
    const StoreMaster = await MASTER_SERVICE.findStore(store.codLocal, store.retail);
    if (StoreMaster.folio && folios.some((folio) => StoreMaster.folio === Number(folio))) {
        if (!store.fecha_sin_venta) {
            return getConnection(client)
                .getCustomRepository(StoreRepository)
                .updateDateB2b(store.actualizacion_b2b, StoreMaster.folio);
        }
        const newStore = new Store();
        newStore.folio = StoreMaster.folio;
        newStore.codLocal = StoreMaster.cod_local ? StoreMaster.cod_local : store.codLocal;
        newStore.bandera = StoreMaster.bandera;
        newStore.direccion = StoreMaster.direccion;
        newStore.cadena = StoreMaster.cadena === "GRUPO FALABELLA" ? "TOTTUS" : StoreMaster.cadena;
        newStore.latitud = StoreMaster.latitud;
        newStore.longitud = StoreMaster.longitud;
        newStore.descripcion = StoreMaster.descripcion;

        store.actualizacion_b2b = moment(store.actualizacion_b2b).format("YYYY-MM-DD");
        newStore.dateB2B = store.actualizacion_b2b;

        const cadem = await SUPI_SERVICE.visitaCadem(StoreMaster.folio);
        newStore.idVisita = cadem.id_visita;
        newStore.mide = cadem.mide;
        newStore.realizada = cadem.realizada;
        newStore.fechaVisita = cadem.fecha_visita;
        newStore.pendiente = cadem.pendiente;
        store.fecha_sin_venta = moment(store.fecha_sin_venta).format("YYYY-MM-DD");
        let Items = await itemService.listItems(
            client, store.codLocal, store.retail, StoreMaster.folio, store.fecha_sin_venta);
        if (cadem.realizada) {
            const toma = await SUPI_SERVICE.tomaVisita(cadem.id_visita);
            Items = itemService.setPresenciaCadem(Items, toma);
            newStore.osa = SUPI_SERVICE.OSA(toma);
        }
        newStore.ventaPerdida = itemService.totalVentaPerdida(Items);
        await Promise.all([
            getConnection(client).getCustomRepository(ItemRepository).removeByStore(StoreMaster.folio),
            getConnection(client).getCustomRepository(StoreRepository).removeByStoreId(StoreMaster.folio),
        ]);
        if (Items.length > 0) {
            await getConnection(client).getCustomRepository(ItemRepository).bulkCreate(client, Items);
        }
        await getConnection(client).getRepository(Store).save(newStore);
    }
}

async function summaryProcess(client: string): Promise<void> {
    moment.locale("es");
    const mov = await getSummary(client);
    const storeMaster = await findStores();
    await getConnection(client).getRepository(Summary).clear();
    for (const chunk of Util.chunk(mov, 5000)) {
        const resultMov: Summary[] = chunk.reduce((acc, current) => {
            const storeDetail = storeMaster.find((row) => {
                return row.retail === current.retail && row.cod_local === current.cod_local;
            });
            if (storeDetail) {
                const movItemStore = new Summary();
                movItemStore.folio = storeDetail.folio;
                movItemStore.ean = current.ean;
                movItemStore.rangeDate = current.range_date;
                movItemStore.rangePosition = current.range_position;
                movItemStore.retail = current.retail;
                movItemStore.codLocal = current.cod_local;
                movItemStore.ventasTotales = current.ventas_totales;
                movItemStore.ventaPerdida = current.venta_perdida;
                movItemStore.itemValido = current.item_valido;
                movItemStore.ventasUnidades = current.venta_unidades;
                movItemStore.bandera = storeDetail.bandera;
                if (Number(movItemStore.ventaPerdida) === 0) {
                    movItemStore.accion = null;
                } else if (current.stock === 0) {
                    movItemStore.accion = "Chequear pedidos";
                } else if (current.stock < 0) {
                    movItemStore.accion = "Ajustar";
                } else {
                    movItemStore.accion = "Reponer";
                }
                acc.push(movItemStore);
            }
            return acc;
        }, []);
        await Summary.bulkCreate(client, resultMov);
    }
}

function getSummary(client: string) {
    const [
        initBeforeMonth, initBeforeWeek, initBeforeDay, finishBeforeMonth, finishBeforeWeek, finishBeforeDay,
        initThisMonth, initThisWeek, initThisDay, finishCurrentMonth, finishCurrentWeek, finishCurrentDay,
    ] = [
            moment().subtract(1, "days").subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
            moment().subtract(1, "days").subtract(1, "week").startOf("week").format("YYYY-MM-DD"),
            moment().subtract(1, "days").subtract(1, "week").format("YYYY-MM-DD"),
            moment().subtract(1, "days").subtract(1, "month").format("YYYY-MM-DD"),
            moment().subtract(1, "days").subtract(1, "week").format("YYYY-MM-DD"),
            moment().subtract(1, "days").subtract(1, "week").format("YYYY-MM-DD"),
            moment().subtract(1, "days").startOf("month").format("YYYY-MM-DD"),
            moment().subtract(1, "days").startOf("week").format("YYYY-MM-DD"),
            moment().subtract(1, "days").format("YYYY-MM-DD"),
            moment().subtract(1, "days").format("YYYY-MM-DD"),
            moment().subtract(1, "days").format("YYYY-MM-DD"),
            moment().subtract(1, "days").format("YYYY-MM-DD"),
        ];

    return Promise.all([
        summary(client, initBeforeMonth, finishBeforeMonth, "month", "before"),
        summary(client, initBeforeWeek, finishBeforeWeek, "week", "before"),
        summary(client, initBeforeDay, finishBeforeDay, "day", "before"),
        summary(client, initThisMonth, finishCurrentMonth, "month", "current"),
        summary(client, initThisWeek, finishCurrentWeek, "week", "current"),
        summary(client, initThisDay, finishCurrentDay, "day", "current"),
    ]).then((mov) => {
        return mov[0].concat(mov[1], mov[2], mov[3], mov[4], mov[5]);
    });
}
