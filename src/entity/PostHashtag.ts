import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("post_hashtag")
export class PostHashtag extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("integer", {
        name: "post_id",
    })
    public postId: number;

    @Column("integer", {
        name: "hashtag_id",
    })
    public hashtagId: number;

}
