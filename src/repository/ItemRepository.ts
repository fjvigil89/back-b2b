import { EntityRepository, getConnection, Repository } from "typeorm";
import { Item } from "../entity";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {

    public removeByStore(folio: number): Promise<void> {
        return this.query(`DELETE FROM item where folio = ${folio}`);
    }

    public findByAction(folio: number, category: string, action: string, today: string): Promise<IItemCase[]> {
        return this.query(`
            SELECT
                a.*
                , IF (
                    b.venta_perdida IS NULL
                    , 0
                    , b.venta_perdida
                ) as gestionado
            FROM item a LEFT JOIN cases b ON
                b.folio = a.folio
                AND a.accion = b.cause
                AND a.ean = b.ean
                AND b.date_action = '${today}'
            WHERE a.folio = ${folio}
                AND a.accion = "${action}"
                AND a.category = "${category}"
            GROUP BY a.ean
            ORDER BY venta_perdida DESC`);
    }

    public findByStoreId(folio: number, today: string): Promise<IItemCase[]> {
        return this.query(`
            SELECT
                a.*, IF(
                    b.venta_perdida IS NULL
                    , 0
                    , b.venta_perdida
                ) as gestionado
            FROM item a LEFT JOIN cases b ON
                b.folio = a.folio
                AND a.accion = b.cause
                AND a.ean = b.ean
                AND b.date_action = '${today}'
        WHERE a.folio = ${folio}
        group by a.ean`);
    }

    public bulkCreate(client: string, Items: Item[]): Promise<any> {
        return getConnection(client).createQueryBuilder().insert().into(Item).values(Items).execute();
    }

    public findItem(ean: string, folio: number, ventaPerdida: number): Promise<Item> {
        return this.findOne({
            where: {
                ean,
                folio,
                ventaPerdida,
            },
        });
    }

}
