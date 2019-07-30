import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("cases")
export class Case extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

    @Column("integer", {
        name: "folio",
    })
    public folio: number;

    @Column("varchar", {
        name: "date_data_b2b",
    })
    public dateB2B: string;

    @Column("varchar", {
        name: "date_action",
    })
    public dateAction: string;

    @Column("varchar")
    public action: string;

    @Column("varchar")
    public cause: string;

    @Column("varchar")
    public ean: string;

    @Column("integer", {
        name: "venta_perdida",
    })
    public ventaPerdida: number;

}
