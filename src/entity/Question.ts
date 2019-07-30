import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("question")
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {
        name: "question",
    })
    public question: string;

    @Column("varchar", {
        name: "type",
    })
    public type: string;

}
