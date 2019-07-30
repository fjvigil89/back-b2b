import { EntityRepository, Repository } from "typeorm";
import { CaseFeedback } from "../entity";

@EntityRepository(CaseFeedback)
export class CaseFeedbackRepository extends Repository<CaseFeedback> {

    public findCaseFeedback(id: number): Promise<CaseFeedback> {
        return this.findOne({
            where: {
                id,
            },
        });
    }

}
