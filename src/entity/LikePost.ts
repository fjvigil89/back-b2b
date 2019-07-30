import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("like_post")
export class LikePost extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("integer", {
        name: "post_id",
    })
    public postId: number;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

}
