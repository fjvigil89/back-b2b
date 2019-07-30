import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("like_comment")
export class LikeComment extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("integer", {
        name: "comment_id",
    })
    public commentId: number;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

}
