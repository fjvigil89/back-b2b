import { EntityRepository, Repository } from "typeorm";
import { Summary } from "../entity";

export type IRange = "day" | "week" | "month";

@EntityRepository(Summary)
export class SummaryRepository extends Repository<Summary> {

    public summaryByRange(userId: string, range: IRange): Promise<Array<{
        ventas_totales_actual: number;
        venta_perdida_actual: number;
        ventas_totales_anterior: number;
        venta_perdida_anterior: number;
        ventas_totales_variacion: number;
        venta_perdida_variacion: number;
        diff_venta_absoluta: number;
        bandera: string;
    }>> {
        return this.query(`SELECT
        ventas_totales_actual,
        venta_perdida_actual,
        ventas_totales_anterior,
        venta_perdida_anterior,
        (100-((ventas_totales_anterior / ventas_totales_actual) * 100)) as ventas_totales_variacion,
        (100-((venta_perdida_anterior / venta_perdida_actual) * 100)) as venta_perdida_variacion,
        ventas_totales_actual - ventas_totales_anterior as diff_venta_absoluta,
        bandera FROM (
            SELECT SUM(a.ventas_totales) as ventas_totales_actual,
            SUM(a.venta_perdida) as venta_perdida_actual,
            c.ventas_totales as ventas_totales_anterior,
            c.venta_perdida as venta_perdida_anterior,
            a.bandera
            FROM summary a
            INNER JOIN user_store b ON
            a.folio = b.folio AND b.user_id = "${userId}"
            INNER JOIN (
                SELECT SUM(d.ventas_totales) as ventas_totales,
                SUM(d.venta_perdida) as venta_perdida,
                range_position,
                bandera
                FROM summary d
                INNER JOIN user_store e ON
                d.folio = e.folio AND e.user_id = "${userId}"
                WHERE d.item_valido = 1 AND d.range_date = "${range}" AND d.range_position = "before"
                GROUP BY d.bandera, d.range_date, d.range_position
            ) c ON
            a.bandera = c.bandera
            WHERE a.item_valido = 1 AND range_date = "${range}" AND a.range_position = "current"
            GROUP BY a.bandera, a.range_date, a.range_position
        ) as summary`);
    }

    public totalCurrent(userId: string, range: IRange): Promise<{
        total_ventas: number,
        venta_perdida: number,
        venta_unidades: number,
    }> {
        return this.query(`SELECT SUM(a.ventas_totales) as ventas_totales_actual,
        SUM(a.venta_perdida) as venta_perdida_actual,
        SUM(a.venta_unidades) as venta_unidades
        FROM summary a
        INNER JOIN user_store b ON
        a.folio = b.folio AND b.user_id = "${userId}"
        WHERE a.item_valido = 1 AND range_date = "${range}" AND a.range_position = "current"
        GROUP BY a.range_date, a.range_position`)
            .then((result) => {
                [result] = result;
                return result ? {
                    total_ventas: result.ventas_totales_actual,
                    venta_perdida: result.venta_perdida_actual,
                    venta_unidades: result.venta_unidades,
                } : { total_ventas: 0, venta_perdida: 0, venta_unidades: 0 };
            });
    }

    public storeVariationClose(userId: string, range: IRange): Promise<Array<{ total: number, bandera: string }>> {
        return this.query(`
            SELECT SUM(ventas_totales) as total, bandera FROM summary WHERE folio in (
                SELECT b.folio as "SALA CERRADA" from (
                    SELECT a.folio from summary a
                    INNER JOIN user_store b
                    ON b.folio = a.folio and b.user_id = "${userId}"
                    WHERE a.range_date = "${range}" and a.range_position = "current"
                    GROUP BY a.folio
                    HAVING SUM(a.ventas_totales) > 0
                ) a
                RIGHT JOIN (
                    SELECT a.folio from summary a
                    INNER JOIN user_store b
                    ON b.folio = a.folio and b.user_id = "${userId}"
                    WHERE a.range_date = "${range}" and a.range_position = "before"
                    GROUP BY a.folio
                    HAVING SUM(a.ventas_totales) > 0
                ) b
                ON a.folio = b.folio
                WHERE a.folio is NULL
            ) AND range_position = "before" AND range_date = "${range}"
            GROUP BY bandera
        `);
    }

    public storeVariationOpen(userId: string, range: IRange): Promise<Array<{ total: number, bandera: string }>> {
        return this.query(`
            SELECT SUM(ventas_totales) as total, bandera FROM summary WHERE folio in (
                SELECT a.folio as "SALA NUEVA" from (
                    SELECT a.folio from summary a
                    INNER JOIN user_store b
                    ON b.folio = a.folio and b.user_id = "${userId}"
                    WHERE a.range_date = "${range}" and a.range_position = "current"
                    GROUP BY a.folio
                ) a
                LEFT JOIN (
                    SELECT a.folio from summary a
                    INNER JOIN user_store b
                    ON b.folio = a.folio and b.user_id = "${userId}"
                    WHERE a.range_date = "${range}" and a.range_position = "before"
                    GROUP BY a.folio
                ) b
                ON a.folio = b.folio
                WHERE b.folio is NULL
            ) AND range_position = "current" AND range_date = "${range}"
            GROUP BY bandera
        `);
    }

    public newItemsVariation(userId: string, range: IRange): Promise<Array<{ bandera: string, venta_total: number }>> {
        return this.query(`
            SELECT a.bandera, SUM(a.ventas_totales) as venta_total
                FROM summary a
                INNER JOIN user_store d
                ON d.folio = a.folio and d.user_id = "${userId}"
                    LEFT JOIN (
                        SELECT c.bandera, c.ean
                        FROM summary c
                        INNER JOIN user_store e
                        ON e.folio = c.folio and e.user_id = "${userId}"
                        WHERE c.item_valido = 1 AND c.range_date = "${range}" AND c.range_position = "before"
                        GROUP BY c.bandera, c.ean
                    ) b ON
                a.bandera = b.bandera AND a.ean = b.ean
                WHERE a.item_valido = 1 AND range_date = "${range}" AND a.range_position = "current" AND b.ean is NULL
            GROUP BY a.bandera
        `);
    }

    public invalidVariation(userId: string, range: IRange): Promise<Array<{ bandera: string, venta_total: number }>> {
        return this.query(`
            SELECT a.bandera, SUM(a.ventas_totales) as venta_total
            FROM summary a
            INNER JOIN user_store b
            ON b.folio = a.folio and b.user_id = "${userId}"
                INNER JOIN (
                    SELECT d.bandera, d.ean, d.item_valido
                    FROM summary d
                    INNER JOIN user_store e
                    ON e.folio = d.folio and e.user_id = "${userId}"
                    WHERE d.item_valido = 0 AND d.range_date = "${range}" AND d.range_position = "current"
                    GROUP BY d.bandera, d.ean
                ) c
            on c.bandera = a.bandera and c.ean = a.ean
            WHERE a.item_valido = 1 AND a.range_date = "${range}" AND a.range_position = "before"
            GROUP BY a.bandera
        `);
    }

    public groupActions(userId: string, range: IRange): Promise<Array<{
        bandera: string,
        venta_perdida: number,
        accion: string,
    }>> {
        return this.query(`
            SELECT
                SUM(a.venta_perdida) as venta_perdida,
                a.bandera, a.accion
            FROM summary a
            INNER JOIN user_store b ON
                a.folio = b.folio AND b.user_id = "${userId}"
            WHERE a.item_valido = 1 AND
                range_date = "${range}" AND
                a.range_position = "current" AND
                a.accion is not NULL
            GROUP BY a.bandera, a.range_date, a.range_position, a.accion
        `);
    }

    public totalInvalidItems(userId: string, range: IRange): Promise<Array<{ bandera: string, total: number }>> {
        return this.query(`
            SELECT a.bandera, count(*) as total
            FROM summary a
            INNER JOIN user_store b ON
                a.folio = b.folio AND b.user_id = "${userId}"
            WHERE
                range_date = "${range}" AND
                a.range_position = "current" and
                a.item_valido = 0
            GROUP BY a.bandera
        `);
    }

}
