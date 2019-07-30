import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("like_reply")
export class LikeReply extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("integer", {
        name: "reply_id",
    })
    public replyId: number;

    @Column("varchar", {
        name: "user_id",
    })
    public userId: string;

}
