import { EntityRepository, Repository } from "typeorm";
import { LikeComment } from "../entity";

@EntityRepository(LikeComment)
export class LikeCommentRepository extends Repository<LikeComment> {

    public async removeLike(like: LikeComment): Promise<void> {
        await this.createQueryBuilder().delete().where(like).execute();
    }

    public findByComment(commentId: number): Promise<LikeComment[]> {
        return this.find({
            where: {
                commentId,
            },
        });
    }

}
