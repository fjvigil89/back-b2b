import * as moment from "moment";
import { getCustomRepository } from "typeorm";
import { Connection } from "../config/database";
import { Store, Summary } from "../entity";
import { ItemRepository, StoreRepository } from "../repository";
import { ItemService } from "../services";
import * as B2B_SERVICE from "../services/external/B2B";
import { summary } from "../services/external/B2B";
import * as MASTER_SERVICE from "../services/external/Master";
import { findStores } from "../services/external/Master";
import * as SUPI_SERVICE from "../services/external/SUPI";
import * as Util from "../utils/service";

function sleep() {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, 60000);
    });
}

export async function StoreScheduler() {
    while (true) {
        await syncStoreB2B();
        await sleep();
    }
}

const itemService = new ItemService();
let folios: string[] = [];

export async function syncStoreB2B(): Promise<void> {
    await Connection;
    const retail = await B2B_SERVICE.getGeneralPending();
    if (retail) {
        console.log("SINCRONIZANDO", retail);
        folios = await getCustomRepository(StoreRepository).listStore();
        const ListStore = await B2B_SERVICE.lastStoreByDate();
        for (const chunk of Util.chunk(ListStore, 100)) {
            await Promise.all(chunk.map(storeProcess));
        }
        await summaryProcess();
        await B2B_SERVICE.resetGeneralPending(retail);
    }
}

async function storeProcess(store: B2B_SERVICE.ILastStoreByDate): Promise<void> {
    const StoreMaster = await MASTER_SERVICE.findStore(store.codLocal, store.retail);
    if (StoreMaster.folio && folios.some((folio) => StoreMaster.folio === Number(folio))) {
        if (!store.fecha_sin_venta) {
            return getCustomRepository(StoreRepository).updateDateB2b(store.actualizacion_b2b, StoreMaster.folio);
        }
        const newStore = new Store();
        newStore.folio = StoreMaster.folio;
        newStore.codLocal = StoreMaster.cod_local ? StoreMaster.cod_local : store.codLocal;
        newStore.bandera = StoreMaster.bandera;
        newStore.direccion = StoreMaster.direccion;
        newStore.cadena = StoreMaster.cadena === "GRUPO FALABELLA" ?  "TOTTUS" : StoreMaster.cadena;
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
        let Items = await itemService.listItems(store.codLocal, store.retail, StoreMaster.folio, store.fecha_sin_venta);
        if (cadem.realizada) {
            const toma = await SUPI_SERVICE.tomaVisita(cadem.id_visita);
            Items = itemService.setPresenciaCadem(Items, toma);
            newStore.osa = SUPI_SERVICE.OSA(toma);
        }
        newStore.ventaPerdida = itemService.totalVentaPerdida(Items);
        await Promise.all([
            getCustomRepository(ItemRepository).removeByStore(StoreMaster.folio),
            getCustomRepository(StoreRepository).removeByStoreId(StoreMaster.folio),
        ]);
        if (Items.length > 0) {
            await getCustomRepository(ItemRepository).bulkCreate(Items);
        }
        await newStore.save();
    }
}

async function summaryProcess(): Promise<void> {
    moment.locale("es");
    const mov = await getSummary();
    const storeMaster = await findStores();
    await Summary.clear();
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
        await Summary.bulkCreate(resultMov);
    }
}

function getSummary() {
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
        summary(initBeforeMonth, finishBeforeMonth, "month", "before"),
        summary(initBeforeWeek, finishBeforeWeek, "week", "before"),
        summary(initBeforeDay, finishBeforeDay, "day", "before"),
        summary(initThisMonth, finishCurrentMonth, "month", "current"),
        summary(initThisWeek, finishCurrentWeek, "week", "current"),
        summary(initThisDay, finishCurrentDay, "day", "current"),
    ]).then((mov) => {
        return mov[0].concat(mov[1], mov[2], mov[3], mov[4], mov[5]);
    });
}
