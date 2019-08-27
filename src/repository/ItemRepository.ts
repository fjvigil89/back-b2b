import { EntityRepository, getConnection, Repository } from "typeorm";
import { Item } from "../entity";

export interface IItemCase {
    ean: number;
    folio: number;
    stock: number;
    description: string;
    category: string;
    accion: string;
    cadem: number;
    venta_perdida: number;
    stock_pedido_tienda: number;
    dias_sin_venta: number;
    gestionado: number;
}

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {

    public removeByStore(folio: number): Promise<void> {
        return this.query(`DELETE FROM item where folio = ${folio}`);
    }

    public findByAction(folio: number, category: string, action: string): Promise<IItemCase[]> {
        return this.query(`SELECT a.*, IF(b.venta_perdida IS NULL, 0, b.venta_perdida) as gestionado from item a
            LEFT JOIN cases b on
            b.folio = a.folio and
            a.accion = b.cause and
            a.ean = b.ean
            WHERE a.folio = ${folio} and a.accion = "${action}" and a.category = "${category}"
            group by a.ean
            order by venta_perdida desc`);
    }

    public findByStoreId(folio: number): Promise<IItemCase[]> {
        return this.query(`SELECT a.*, IF(b.venta_perdida IS NULL, 0, b.venta_perdida) as gestionado from item a
        LEFT JOIN cases b on
        b.folio = a.folio and
        a.accion = b.cause and
        a.ean = b.ean
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
