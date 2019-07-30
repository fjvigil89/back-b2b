import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("post")
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public content: string;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

    @Column("varchar")
    public date: string;

}
