import { EntityRepository, Repository } from "typeorm";
import { LikePost } from "../entity";

@EntityRepository(LikePost)
export class LikePostRepository extends Repository<LikePost> {

    public async removeLike(like: LikePost): Promise<void> {
        await this.createQueryBuilder().delete().where(like).execute();
    }

    public findByPost(postId: number): Promise<LikePost[]> {
        return this.find({
            where: {
                postId,
            },
        });
    }

}
