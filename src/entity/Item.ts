import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("item")
export class Item extends BaseEntity {

    @PrimaryColumn("integer")
    public id: number;

    @Column("integer")
    public ean: number;

    @Column("integer")
    public folio: number;

    @Column("integer")
    public stock: number;

    @Column("varchar")
    public description: string;

    @Column("varchar")
    public category: string;

    @Column("varchar")
    public accion: string;

    @Column("integer")
    public cadem: number;

    @Column("integer", { name: "venta_perdida" })
    public ventaPerdida: number;

    @Column("integer", { name: "stock_pedido_tienda" })
    public stockPedidoTienda: number;

    @Column("integer", { name: "dias_sin_venta" })
    public diasSinVenta: number;

}
