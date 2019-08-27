import * as moment from "moment";
import { getConnection } from "typeorm";
import { Reply } from "../entity";
import { ReplyRepository } from "../repository";

export class ReplyService {

    public async updateReply(client: string, content: string, commentId: number): Promise<void> {
        await getConnection(client).getCustomRepository(ReplyRepository).update(commentId, {
            content,
            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        });
    }

    public findByComment(client: string, id: number): Promise<Reply[]> {
        return getConnection(client).getCustomRepository(ReplyRepository).findByComment(id);
    }

}
