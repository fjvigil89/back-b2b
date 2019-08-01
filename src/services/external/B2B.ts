import * as moment from "moment";
import { B2B } from "../../config/database";

interface IDetailItem {
    stock: number;
    ean: number;
    stockPedidoTienda: number;
    diasSinVenta: number;
    itemId: number;
    promedioVentas: number;
    ventaUnidades: number;
}

export interface ILastStoreByDate {
    fecha_sin_venta: string | null;
    actualizacion_b2b: string;
    codLocal: string;
    retail: string;
}

export async function lastStoreByDate(): Promise<ILastStoreByDate[]> {
    return B2B.then((conn) => conn.query(`
    SELECT
        a.cod_local as codLocal
        , a.retail
        , MAX(a.fecha) as fecha_sin_venta
        , b.actualizacion_b2b
    FROM
        movimiento_last_days a
    LEFT JOIN (
        SELECT
            cod_local
            , retail
            , MAX(fecha) as actualizacion_b2b
        FROM
            movimiento_last_days
        GROUP BY
            cod_local, retail
    ) b ON
        a.cod_local = b.cod_local
        AND a.retail = b.retail
    WHERE a.venta_unidades IS NOT NULL
    GROUP BY a.cod_local, a.retail
    `));
}

export async function clearLastDays(date): Promise<void> {
    return B2B.then((conn) => conn.query(`DELETE FROM movimiento_last_days WHERE fecha = '${date}'`));
}

export async function clearItems(): Promise<void> {
    return B2B.then((conn) => conn.query(`DELETE FROM movimiento_last_days WHERE venta_unidades != 0`));
}

export async function loadLastDays(date: string, retail: string): Promise<void> {
    return B2B.then((conn) => conn.query(`INSERT INTO movimiento_last_days
    SELECT * from movimiento WHERE fecha = "${date}" AND itemValido = 1 AND retail = "${retail}"`));
}

export async function detailItems(StoreId: any, retail: string, date: string): Promise<IDetailItem[]> {
    return B2B.then((conn) => conn.query(`SELECT stock, ean, IFNULL(stock_pedido_tienda, 0) as stockPedidoTienda,
    IFNULL(dias_sin_venta_consecutiva, 0) as diasSinVenta, cod_item as itemId, promedio_ventas as promedioVentas,
    venta_unidades AS ventaUnidades FROM movimiento_last_days WHERE cod_local = "${StoreId}" AND
    fecha = "${date}" AND retail = "${retail}"`));
}

export function checkLastDate(StoreId: string): Promise<string | null> {
    return B2B.then((conn) => conn.query(`
        SELECT fecha
        FROM movimiento
        WHERE
            cod_local = "${StoreId}"
        ORDER BY fecha DESC
        LIMIT 1
    `)
    .then((result) => moment(result[0].fecha).format("YYYY-MM-DD")));
}

export function staticStock(storeId: string, itemId: number, dateFrom: string): Promise<boolean> {
    return B2B.then((conn) => conn.query(`
            SELECT
                stock
            FROM movimiento
            WHERE
                cod_local = "${storeId}"
                AND cod_item = ${itemId}
                AND fecha > "${dateFrom}"
        `))
        .then((result) => new Set(result.map((row) => row.stock)).size === 1 ? true : false);
}

export function getGeneralPending(): Promise<string> {
    return B2B.then((conn) => conn.query("SELECT * FROM `general` WHERE sincronizacion_app = 1 LIMIT 1")
        .then((result) => {
            if (result.length) {
                return result[0].retail;
            } else {
                return null;
            }
        }));
}

export async function resetGeneralPending(retail: string): Promise<void> {
    await B2B.then((conn) => conn.query("UPDATE `general` SET sincronizacion_app = 0 WHERE retail = " + `"${retail}"`));
}

export function summary(
    init: string,
    finish: string,
    rangeDate: string,
    rangePosition: string,
): Promise<Array<{
    range_date: string;
    range_position: string;
    retail: string;
    cod_local: string;
    ean: string;
    ventas_totales: number;
    venta_perdida: number;
    venta_unidades: number;
    item_valido: number;
    stock: number;
    sum_venta_perdida: number;
}>> {
    return B2B.then((conn) => conn.query(`
        SELECT
            "${rangeDate}" as range_date
            , "${rangePosition}" as range_position
            , retail
            , cod_local
            , ean
            , SUM(venta_valor) as ventas_totales
            , SUM(CASE WHEN venta_unidades = 0 THEN
                IF(promedio_ventas IS NULL, 0, promedio_ventas)
                ELSE 0
              END) as venta_perdida
            , SUM(CASE WHEN itemValido = 1 THEN IF(venta_unidades >= 0, venta_unidades, 0) ELSE 0 END) as venta_unidades
            , MAX(itemValido) as item_valido
            , stock
            , SUM(promedio_ventas) AS sum_venta_perdida
        FROM movimiento
        WHERE
            fecha BETWEEN "${init}"
            AND "${finish}"
        GROUP BY retail, cod_item, cod_local
    `));
}

export function getDataMovimiento(fecha: string, retail: string): Promise<void> {
    return B2B.then((conn) => conn.query(`
        SELECT *
        FROM movimiento
        WHERE
            retail = '${retail}'
            AND fecha = '${fecha}'
        LIMIT 20
    `));
}