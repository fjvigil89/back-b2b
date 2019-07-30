import { EntityRepository, Repository } from "typeorm";
import { Reply } from "../entity";

@EntityRepository(Reply)
export class ReplyRepository extends Repository<Reply> {

    public findByComment(commentId: number): Promise<Reply[]> {
        return this.find({
            order: {
                date: "ASC",
            },
            where: {
                commentId,
            },
        });
    }

}
