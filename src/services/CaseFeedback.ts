import { getCustomRepository } from "typeorm";
import { CaseFeedback } from "../entity";
import { CasesRepository, QuestionRepository } from "../repository";

export class CaseFeedbackService {

    public async create(newCaseFeedback: CaseFeedback): Promise<number> {
        const { folio, ean, date, questionId } = newCaseFeedback;
        const [ question, existCase ] = await Promise.all([
            getCustomRepository(QuestionRepository).findQuestion(questionId),
            getCustomRepository(CasesRepository).findCase(folio, ean, date),
        ]);

        if (!question) {
            throw new Error("Question not exists");
        } else if (existCase) {
            const resultCreate = await newCaseFeedback.save();
            return resultCreate.id;
        }
    }

}
