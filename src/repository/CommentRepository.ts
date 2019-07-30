import { EntityRepository, Repository } from "typeorm";
import { Comment } from "../entity";

export interface IListComment {
    userName: string;
    id: number;
    content: string;
    date: string;
    userId: string;
    contentReply: string;
    dateReply: string;
    replyId: number;
    replyUserName: string;
    replyUserId: number;
    likeCommentId: number;
    likeReplyId: number;
    idUserLike: string;
    idUserLikeReply: string;
    image: string;
    imageReply: string;
}

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {

    public findCommentDetail(postId?: number, commentId?: number): Promise<IListComment[]> {
        return this.query(`SELECT b.name as userName, c.id as replyId,
        a.id as id, a.content as content,
        a.date as date, b.id as userId,
        c.content as contentReply, c.date as dateReply,
        e.name as replyUserName, e.id as replyUserId,
        d.id as likeCommentId, g.id as likeReplyId,
        d.user_id as idUserLike, g.user_id as idUserLikeReply,
        a.image as image, c.image as imageReply
        FROM comment a
        INNER JOIN user b ON
        a.user_id = b.id
        LEFT JOIN reply c ON
        a.id = c.comment_id
        LEFT JOIN like_comment d ON
        d.comment_id = a.id
        LEFT JOIN like_reply g ON
        g.reply_id = c.id
        LEFT JOIN user e
        ON c.user_id = e.id
        ${postId ? `WHERE a.post_id = ${postId}` : ``}
        ${commentId ? `WHERE a.id = ${commentId}` : ``}
        ORDER BY a.date ASC`);
    }

}
