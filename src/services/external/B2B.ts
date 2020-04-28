import * as moment from "moment";
import { B2B } from "../../config/database";

export async function lastStoreByDate(client: string): Promise<ILastStoreByDate[]> {
    return B2B[client].then((conn) => conn.query(`
    SELECT
        a.cod_local as codLocal
        , a.retail
        , MAX(a.fecha) as fecha_sin_venta
        , b.actualizacion_b2b
    FROM
        movimiento a
    LEFT JOIN (
        SELECT
            cod_local
            , retail
            , MAX(fecha) as actualizacion_b2b
        FROM
            movimiento
        GROUP BY
            cod_local, retail
    ) b ON
        a.cod_local = b.cod_local
        AND a.retail = b.retail
    WHERE a.venta_unidades IS NOT NULL
    GROUP BY a.cod_local, a.retail
    `));
}

export async function clearLastDays(client: string, date): Promise<void> {
    return B2B[client].then((conn) => conn.query(`DELETE FROM movimiento_last_days WHERE fecha = '${date}'`));
}

export async function clearItems(client: string): Promise<void> {
    return B2B[client].then((conn) => conn.query(`DELETE FROM movimiento_last_days WHERE venta_unidades != 0`));
}

export async function loadLastDays(client: string, date: string, retail: string): Promise<void> {
    return B2B[client].then((conn) => conn.query(`INSERT INTO movimiento_last_days
    SELECT * from movimiento WHERE fecha = "${date}" AND itemValido = 1 AND retail = "${retail}"`));
}

export async function detailItems(client: string, StoreId: any, retail: string, date: string): Promise<IDetailItem[]> {
    return B2B[client].then((conn) =>
        conn.query(`SELECT stock, ean, IFNULL(stock_pedido_tienda, 0) as stockPedidoTienda,
        IFNULL(dias_sin_venta_consecutiva, 0) as diasSinVenta, cod_item as itemId, promedio_ventas as promedioVentas,
        venta_unidades AS ventaUnidades FROM movimiento_last_days WHERE cod_local = "${StoreId}" AND
        fecha = "${date}" AND retail = "${retail}"`));
}

export function checkLastDate(client: string, StoreId: string): Promise<string | null> {
    return B2B[client].then((conn) => conn.query(`
        SELECT fecha
        FROM movimiento
        WHERE
            cod_local = "${StoreId}"
        ORDER BY fecha DESC
        LIMIT 1
    `)
        .then((result) => moment(result[0].fecha).format("YYYY-MM-DD")));
}

export function staticStock(client: string, storeId: string, itemId: number, dateFrom: string): Promise<boolean> {
    return B2B[client].then((conn) => conn.query(`
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

export function getGeneralPending(client: string): Promise<string> {
    return B2B[client].then((conn) =>
        conn.query("SELECT * FROM `general` WHERE sincronizacion_app = 1 AND sync_started IS FALSE LIMIT 1")
            .then((result) => {
                if (result.length) {
                    return result[0].retail;
                } else {
                    return null;
                }
            }));
}

export async function startSyncGeneral(client: string, retail: string): Promise<void> {
    await B2B[client].then((conn) =>
        conn.query("UPDATE `general` SET sync_started = TRUE WHERE retail = " + `"${retail}"`));
}

export async function stopSyncGeneral(client: string, retail: string): Promise<void> {
    await B2B[client].then((conn) =>
        conn.query("UPDATE `general` SET sync_started = FALSE WHERE retail = " + `"${retail}"`));
}

export async function resetGeneralPending(client: string, retail: string): Promise<void> {
    await B2B[client].then((conn) =>
        conn.query("UPDATE `general` SET sincronizacion_app = 0 WHERE retail = " + `"${retail}"`));
}

export function summary(
    client: string,
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
    return B2B[client].then((conn) => conn.query(`
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

export function getDataMovimiento(client: string, fecha: string, retail: string): Promise<void> {
    return B2B[client].then((conn) => conn.query(`
        SELECT *
        FROM movimiento
        WHERE
            retail = '${retail}'
            AND fecha = '${fecha}'
        LIMIT 20
    `));
}

export async function getVentaValor(client: string, cod_locales: string[]): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
        SELECT
        a.cod_local,
        a.retail,
        SUM(a.venta_valor) AS venta_valor
    FROM
        movimiento AS a
    WHERE
        a.cod_local IN (${cod_locales})
        AND a.fecha = (
            SELECT
                MAX(b.fecha)
            FROM
                movimiento AS b
            WHERE
                b.cod_local = a.cod_local
                AND a.retail = b.retail)
        GROUP BY
            a.cod_local,
            a.retail`));
}

export async function getMTB(client: string, cod_local: string, retail: string, today: string, initialMonth: string): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
    SELECT
        SUM(a.venta_valor) AS venta_valor
    FROM
        movimiento AS a
    WHERE
        a.cod_local = "${cod_local}" AND
        a.retail = "${retail}" AND
        a.fecha BETWEEN "${initialMonth}" AND "${today}"
        GROUP BY
            a.cod_local,
            a.retail`));
}

export async function getMTBLY(client: string, cod_local: string, retail: string, today: string, initialMonth: string): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
    SELECT
        SUM(a.venta_valor) AS venta_valor
    FROM
        movimiento_historia_2019 AS a
    WHERE
        a.cod_local = "${cod_local}" AND
        a.retail = "${retail}" AND
        a.fecha BETWEEN "${initialMonth}" AND "${today}"
        GROUP BY
            a.cod_local,
            a.retail`));
}

export async function getTarget(client: string, cod_local: string, retail: string, initial: string, finish: string): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
    SELECT
        a.target AS target
    FROM
        Target AS a
    WHERE
        a.cod_local = "${cod_local}" AND
        a.retail = "${retail}" AND
        a.fecha BETWEEN "${initial}" AND "${finish}"`));
}

export async function getYTB(client: string, cod_local: string, retail: string, today: string, initialYear: string): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
    SELECT
        SUM(a.venta_valor) AS venta_valor
    FROM
        movimiento AS a
    WHERE
        a.cod_local = "${cod_local}" AND
        a.retail = "${retail}" AND
        a.fecha BETWEEN "${initialYear}" AND "${today}"
        GROUP BY
            a.cod_local,
            a.retail`));
}

export async function getYTBLY(client: string, cod_local: string, retail: string, today: string, initialYearLastYear: string): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
    SELECT
        SUM(a.venta_valor) AS venta_valor
    FROM
        movimiento_historia_2019 AS a
    WHERE
        a.cod_local = "${cod_local}" AND
        a.retail = "${retail}" AND
        a.fecha BETWEEN "${initialYearLastYear}" AND "${today}"
        GROUP BY
            a.cod_local,
            a.retail`));
}

export async function getTargetYear(client: string, cod_local: string, retail: string, initial: string, finish: string): Promise<any[]> {
    return B2B[client].then((conn) =>
        conn.query(`
    SELECT
        SUM(a.target) AS target
    FROM
        Target AS a
    WHERE
        a.cod_local = "${cod_local}" AND
        a.retail = "${retail}" AND
        a.fecha BETWEEN "${initial}" AND "${finish}"`));
}

export async function getMtdByCategory(client: string, cod_local: string, retail: string, today: string, initialMonth: string): Promise<any[]> {
    try {
        return B2B[client].then((conn) =>
            conn.query(`
            SELECT
            distinct item.i_categoria as categoria,
            SUM(mov.venta_valor) as venta_valor
            FROM movimiento mov
            LEFT JOIN item_master item on mov.ean = item.i_ean
            WHERE mov.cod_local="${cod_local}" and retail="${retail}" and item.i_categoria is not null
            AND mov.fecha BETWEEN "${initialMonth}" AND "${today}"
            GROUP BY
                item.i_categoria
            ORDER BY sum(mov.venta_valor) desc
        `));
    } catch (err) {
        console.log("err", err);
    }
}

export async function getMtdLyByCategory(client: string, cod_local: string, retail: string, initial: string, finish: string): Promise<any[]> {
    try {
        return B2B[client].then((conn) =>
            conn.query(`
            SELECT
            distinct item.i_categoria as categoria,
            SUM(mov.venta_valor) as venta_valor
            FROM movimiento_historia_2019 mov
            LEFT JOIN item_master item on mov.ean = item.i_ean
            WHERE mov.fecha BETWEEN "${initial}" AND "${finish}"
            AND mov.cod_local="${cod_local}" AND
            retail="${retail}" and item.i_categoria is not null
            GROUP BY
                item.i_categoria
            ORDER BY sum(mov.venta_valor) desc
        `));
    } catch (err) {
        console.log("err", err);
    }
}

export async function getYtdByCategory(
    client: string,
    cod_local: string,
    retail: string,
    today: string,
    initialYear: string): Promise<any> {
    return B2B[client].then((conn) =>
        conn.query(`
        SELECT
        distinct item.i_categoria as categoria,
        SUM(mov.venta_valor) as venta_valor
        FROM movimiento mov
        LEFT JOIN item_master item on mov.ean = item.i_ean
        WHERE mov.cod_local="${cod_local}" and mov.retail="${retail}" and item.i_categoria is not null
        AND mov.fecha BETWEEN "${initialYear}" AND "${today}"
        GROUP BY
            item.i_categoria
        ORDER BY sum(mov.venta_valor) desc
    `));
}

export const getYtdLyByCategory = async (
    client: string,
    cod_local: string,
    retail: string,
    todayLastYear: string,
    initialLastYear: string): Promise<any> => {
    return B2B[client].then((conn) =>
        conn.query(`
        SELECT
        distinct item.i_categoria as categoria,
        SUM(mov.venta_valor) as venta_valor
        FROM movimiento_historia_2019 mov
        LEFT JOIN item_master item on mov.ean = item.i_ean
        WHERE mov.cod_local="${cod_local}" and mov.retail="${retail}" and item.i_categoria is not null
        AND mov.fecha BETWEEN "${initialLastYear}" AND "${todayLastYear}"
        GROUP BY
            item.i_categoria
        ORDER BY sum(mov.venta_valor) desc
    `));
};
