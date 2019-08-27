import { getConnection } from "typeorm";
import { LikePost } from "../entity";
import { LikePostRepository } from "../repository";

export class LikePostService {

    public removeLike(client: string, like: LikePost): Promise<void> {
        return getConnection(client).getCustomRepository(LikePostRepository).removeLike(like);
    }

    public findByPost(client: string, id: number): Promise<LikePost[]> {
        return getConnection(client).getCustomRepository(LikePostRepository).findByPost(id);
    }

}
