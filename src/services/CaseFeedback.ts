import { getConnection } from "typeorm";
import { CaseFeedback } from "../entity";
import { CasesRepository, QuestionRepository } from "../repository";

export class CaseFeedbackService {

    public async create(client: string, newCaseFeedback: any): Promise<number> {
        const { folio, ean, date, questionId } = newCaseFeedback;
        const [question, existCase] = await Promise.all([
            getConnection(client).getCustomRepository(QuestionRepository).findQuestion(questionId),
            getConnection(client).getCustomRepository(CasesRepository).findCase(folio, ean, date),
        ]);

        if (!question) {
            throw new Error("Question not exists");
        } else if (existCase) {
            const resultCreate = await getConnection(client).getRepository(CaseFeedback).save(newCaseFeedback);
            return resultCreate.id;
        }
    }

}
