import { getCustomRepository } from "typeorm";
import { Question } from "../entity";
import { QuestionRepository } from "../repository";

export class QuestionService {

    public async getQuestions(): Promise<Question[]> {
        const questions = await getCustomRepository(QuestionRepository).getQuestions();
        return questions;
    }

}
