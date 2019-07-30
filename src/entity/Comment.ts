import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comment")
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public content: string;

    @Column("integer", {
        name: "post_id",
    })
    public postId: number;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

    @Column("varchar")
    public date: string;

    @Column("varchar")
    public image: string;

}
