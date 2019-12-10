import * as moment from "moment";
import { getConnection } from "typeorm";
import { CommentRepository } from "../repository";
import * as Util from "../utils/service";

export class CommentService {

    public listGroupCommentDetail(client: string, id: number, userId: string): Promise<IListCommentDetail[]> {
        return getConnection(client).getCustomRepository(CommentRepository).findCommentDetail(id)
            .then((comments) => {
                const commentsId: number[] = Util.uniqBy(comments, "id");
                return commentsId.map((commentId) => {
                    const commentsById = comments.filter((comment) => comment.id === commentId);
                    return this.groupDetailComment(commentsById, userId);
                });
            });
    }

    public detailComment(client: string, id: number, userId: string) {
        return getConnection(client).getCustomRepository(CommentRepository).findCommentDetail(null, id)
            .then((comment) => {
                return this.groupDetailComment(comment, userId);
            });
    }

    public groupDetailComment(commentUniqId: IListComment[], userId: string): IListCommentDetail {
        const repliesByUniqId = this.groupReplyComment(commentUniqId, userId);
        const totalReplies = repliesByUniqId[0] ? repliesByUniqId.length : 0;
        const totalLikes = this.totalLike(commentUniqId, "likeCommentId");
        const enableLike = !commentUniqId.some((post) => post.idUserLike === userId);
        return {
            content: commentUniqId[0].content,
            currentDate: new Date(),
            date: commentUniqId[0].date,
            enableLike,
            id: commentUniqId[0].id,
            image: commentUniqId[0].image,
            replies: repliesByUniqId,
            totalLikes,
            totalReplies,
            userId: commentUniqId[0].userId,
            userName: commentUniqId[0].userName,
        };
    }

    private totalLike(commentUniqId: IListComment[], attr: string): number {
        return Util.uniqBy(commentUniqId.filter((row) => row[attr]), attr).length;
    }

    private groupReplyComment(commentUniqId: IListComment[], userId: string): IListReplies[] {
        const repliesId: number[] = Util.uniqBy(commentUniqId, "replyId");
        return repliesId.reduce((acc, current) => {
            if (current) {
                const replies = commentUniqId.filter((comment) => current === comment.replyId);
                const totalLikes = this.totalLike(replies, "likeReplyId");
                const enableLike = !replies.some((reply) => reply.idUserLikeReply === userId);
                acc.push({
                    content: replies[0].contentReply,
                    currentDate: new Date(),
                    date: replies[0].dateReply,
                    enableLike,
                    id: replies[0].replyId,
                    image: replies[0].imageReply,
                    totalLikes,
                    userId: replies[0].replyUserId,
                    userName: replies[0].replyUserName,
                });
            }
            return acc;
        }, []).sort((a, b) => moment(a.date).diff(moment(b.date)));
    }

}
