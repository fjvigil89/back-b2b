import { BaseEntity, Column, Entity, getConnection, PrimaryColumn } from "typeorm";

@Entity("summary")
export class Summary extends BaseEntity {

    public static bulkCreate(client: string, mov: Summary[]): Promise<any> {
        return getConnection(client).createQueryBuilder().insert().into(Summary).values(mov).execute();
    }

    @PrimaryColumn("integer")
    public folio: number;

    @Column("integer")
    public ean: string;

    @Column("varchar", {
        name: "range_date",
    })
    public rangeDate: string;

    @Column("varchar", {
        name: "range_position",
    })
    public rangePosition: string;

    @Column("varchar")
    public retail: string;

    @Column("varchar", {
        name: "cod_local",
    })
    public codLocal: string;

    @Column("varchar", {
        name: "bandera",
    })
    public bandera: string;

    @Column("integer", {
        name: "ventas_totales",
    })
    public ventasTotales: number;

    @Column("integer", {
        name: "venta_unidades",
    })
    public ventasUnidades: number;

    @Column("integer", {
        name: "venta_perdida",
    })
    public ventaPerdida: number;

    @Column("varchar", {
        name: "item_valido",
    })
    public itemValido: number;

    @Column("varchar", {
        name: "accion",
    })
    public accion: string;

}
