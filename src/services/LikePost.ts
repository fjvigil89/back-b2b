import { getCustomRepository } from "typeorm";
import { LikePost } from "../entity";
import { LikePostRepository } from "../repository";

export class LikePostService {

    public removeLike(like: LikePost): Promise<void> {
        return getCustomRepository(LikePostRepository).removeLike(like);
    }

    public findByPost(id: number): Promise<LikePost[]> {
        return getCustomRepository(LikePostRepository).findByPost(id);
    }

}
