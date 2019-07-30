import { getCustomRepository } from "typeorm";
import { LikeComment } from "../entity";
import { LikeCommentRepository } from "../repository";

export class LikeCommentService {

    public removeLike(like: LikeComment): Promise<void> {
        return getCustomRepository(LikeCommentRepository).removeLike(like);
    }

    public findByComment(id: number): Promise<LikeComment[]> {
        return getCustomRepository(LikeCommentRepository).findByComment(id);
    }

}
