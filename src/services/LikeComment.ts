import { getConnection } from "typeorm";
import { LikeComment } from "../entity";
import { LikeCommentRepository } from "../repository";

export class LikeCommentService {

    public removeLike(client: string, like: LikeComment): Promise<void> {
        return getConnection(client).getCustomRepository(LikeCommentRepository).removeLike(like);
    }

    public findByComment(client: string, id: number): Promise<LikeComment[]> {
        return getConnection(client).getCustomRepository(LikeCommentRepository).findByComment(id);
    }

}
