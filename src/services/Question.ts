import { getConnection } from "typeorm";
import { Question } from "../entity";
import { QuestionRepository } from "../repository";

export class QuestionService {

    public async getQuestions(client: string): Promise<Question[]> {
        const questions = await getConnection(client).getCustomRepository(QuestionRepository).getQuestions();
        return questions;
    }

}
