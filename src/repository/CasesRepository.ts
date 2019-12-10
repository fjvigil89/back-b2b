import { EntityRepository, Repository } from "typeorm";
import { Case } from "../entity";

@EntityRepository(Case)
export class CasesRepository extends Repository<Case> {

    public totalCasesByDate(folio: number, fecha: string): Promise<number> {
        return this.query(`
            SELECT SUM(venta_perdida) AS total
            FROM cases
            WHERE folio = ${folio}
                AND date_action = "${fecha}"
            GROUP BY folio, date_action
        `).then((result) => {
            if (result.length) {
                return result[0].total;
            } else {
                return 0;
            }
        });
    }

    public totalCasesbyCategory(folio: number, fecha: string): Promise<number> {
        return this.query(`
            SELECT SUM(venta_perdida) AS total
            FROM cases
            WHERE folio = ${folio}
                AND date_action = "${fecha}"
            GROUP BY folio, date_action
        `).then((result) => {
            if (result.length) {
                return result[0].total;
            } else {
                return 0;
            }
        });
    }

    public findCase(folio: number, ean: string, dateAction: string): Promise<Case> {
        return this.findOne({
            where: {
                folio,
                dateAction,
                ean,
            },
        });
    }

}
