import { EntityRepository, getConnection, Repository } from "typeorm";
import { Store } from "../entity";

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {

    public removeByStoreId(folio: number): Promise<void> {
        return this.query(`DELETE FROM store
        WHERE folio = ${folio}`);
    }

    public bulkCreate(Stores: Store[]): Promise<any> {
        return getConnection().createQueryBuilder().insert().into(Store).values(Stores).execute();
    }

    public findByStoreId(folio: number): Promise<Store> {
        return this.findOne({
            where: {
                folio,
            },
        });
    }

    public async updateDateB2b(date: string, folio: number): Promise<void> {
        await this.update({
            dateB2B: date,
        }, {
            folio,
        });
    }

    public dataStore(folios: string[], userId: string): Promise<any[]> {
        return this.query(`SELECT a.*,
        IF(b.id_sala_encuesta is NOT NULL, 1, 0) as hasPoll,
        IF(lastCheck.id IS NOT NULL AND lastCheck.date_check_out IS NULL, 1, 0) as visita_en_progreso FROM store a
        LEFT JOIN (
            SELECT folio, id_sala_encuesta from encuesta a
            INNER JOIN sala_encuesta b
            ON a.id = b.id_encuesta
            WHERE a.estado = 1 AND b.estado = 1
            GROUP BY folio
        ) b ON
            a.folio = b.folio
        LEFT JOIN (
            SELECT * from ${"`check`"} WHERE user_id = "${userId}" ORDER by date_check_in DESC LIMIT 1
        ) as lastCheck ON
        a.folio = lastCheck.folio
        WHERE a.folio IN (${folios}) AND a.venta_perdida > 0 AND a.cadena is NOT NULL
        ORDER BY a.venta_perdida DESC`);
    }

    public listStoreUser(user: string): Promise<string[]> {
        return this.query(`SELECT b.folio FROM user a
            INNER JOIN user_store b
            ON a.id = b.user_id
            WHERE a.id = "${user}"`)
                .then((stores) => {
                    return stores.map((store) => store.folio);
                });
    }

    public listStore(): Promise<string[]> {
        return this.query(`SELECT DISTINCT folio from user_store`)
            .then((stores) => {
                return stores.map((store) => store.folio);
            });
    }

    public updateDates(): Promise<Array<{ fecha: string, nombre: string }>> {
        return this.query(`SELECT max(date_b2b) as fecha, bandera as nombre from store GROUP by bandera`);
    }

}
