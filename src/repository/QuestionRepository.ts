import { EntityRepository, Repository } from "typeorm";
import { Question } from "../entity";

@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {

    public getQuestions(): Promise<Question[]> {
        return this.find({});
    }

    public findQuestion(id: number): Promise<Question> {
        return this.findOne({
            where: {
                id,
            },
        });
    }

}
