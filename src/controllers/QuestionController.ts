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
        const { client } = this.req.user;
        try {
            const questions = await this.questionService.getQuestions(client);
            return this.res.status(200).json({ questions });
        } catch (ex) {
            console.error(ex);
            return this.res.status(500).send();
        }
    }

}
