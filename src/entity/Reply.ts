import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("reply")
export class Reply extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public content: string;

    @Column("integer", {
        name: "comment_id",
    })
    public commentId: number;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

    @Column("varchar")
    public date: string;

    @Column("varchar")
    public image: string;

}
