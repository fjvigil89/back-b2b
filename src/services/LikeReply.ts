import { getCustomRepository } from "typeorm";
import { LikeReply } from "../entity";
import { LikeReplyRepository } from "../repository";

export class LikeReplyService {

    public removeLike(like: LikeReply): Promise<void> {
        return getCustomRepository(LikeReplyRepository).removeLike(like);
    }

    public findByReply(id: number): Promise<LikeReply[]> {
        return getCustomRepository(LikeReplyRepository).findByReply(id);
    }

}
