import * as moment from "moment";
import { getCustomRepository } from "typeorm";
import { Reply } from "../entity";
import { ReplyRepository } from "../repository";

export class ReplyService {

    public async updateReply(content: string, commentId: number): Promise<void> {
        await getCustomRepository(ReplyRepository).update(commentId, {
            content,
            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        });
    }

    public findByComment(id: number): Promise<Reply[]> {
        return getCustomRepository(ReplyRepository).findByComment(id);
    }

}
