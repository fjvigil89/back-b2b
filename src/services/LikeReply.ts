import { getConnection } from "typeorm";
import { LikeReply } from "../entity";
import { LikeReplyRepository } from "../repository";

export class LikeReplyService {

    public removeLike(client: string, like: LikeReply): Promise<void> {
        return getConnection(client).getCustomRepository(LikeReplyRepository).removeLike(like);
    }

    public findByReply(client: string, id: number): Promise<LikeReply[]> {
        return getConnection(client).getCustomRepository(LikeReplyRepository).findByReply(id);
    }

}
