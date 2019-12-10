import { EntityRepository, Repository } from "typeorm";
import { Comment } from "../entity";

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {

    public findCommentDetail(postId?: number, commentId?: number): Promise<IListComment[]> {
        return this.query(`
        SELECT
            b.name AS userName
            , c.id AS replyId
            , a.id AS id
            , a.content AS content
            , a.date AS date
            , b.id AS userId
            , c.content AS contentReply
            , c.date AS dateReply
            , e.name AS replyUserName
            , e.id AS replyUserId
            , d.id AS likeCommentId
            , g.id AS likeReplyId
            , d.user_id AS idUserLike
            , g.user_id AS idUserLikeReply
            , a.image AS image
            , c.image AS imageReply
        FROM comment a
        INNER JOIN user b ON
            a.user_id = b.id
        LEFT JOIN reply c ON
            a.id = c.comment_id
        LEFT JOIN like_comment d ON
            d.comment_id = a.id
        LEFT JOIN like_reply g ON
            g.reply_id = c.id
        LEFT JOIN user e ON
            c.user_id = e.id
        ${postId ? `WHERE a.post_id = ${postId}` : ``}
        ${commentId ? `WHERE a.id = ${commentId}` : ``}
        ORDER BY a.date ASC`);
    }
}
