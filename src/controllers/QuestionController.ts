import { Request, Response } from "express";
import { QuestionService } from "../services";
import { Controller } from "./Controller";

export class QuestionController extends Controller {

    private questionService: QuestionService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.questionService = new QuestionService();
    }

    public async list(): Promise<Response> {
        try {
            const questions = await this.questionService.getQuestions();
            return this.res.status(200).json({ questions }).send();
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

}
