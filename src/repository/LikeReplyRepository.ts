import { EntityRepository, Repository } from "typeorm";
import { LikeReply } from "../entity";

@EntityRepository(LikeReply)
export class LikeReplyRepository extends Repository<LikeReply> {

    public async removeLike(like: LikeReply): Promise<void> {
        await this.createQueryBuilder().delete().where(like).execute();
    }

    public findByReply(replyId: number): Promise<LikeReply[]> {
        return this.find({
            where: {
                replyId,
            },
        });
    }

}
