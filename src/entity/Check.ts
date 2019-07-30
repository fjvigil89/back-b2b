import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("check")
export class Check extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {
        name: "date_check_in",
    })
    public dateCheckIn: string;

    @Column("varchar", {
        name: "date_check_out",
    })
    public dateCheckOut: string;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

    @Column("integer")
    public folio: number;

}
