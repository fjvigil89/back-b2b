import { Request, Response } from "express";
import { SummaryService } from "../services";
import { Controller } from "./Controller";

export class SummaryController extends Controller {

    private summaryService: SummaryService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.summaryService = new SummaryService();
    }

    public async index(): Promise<Response> {
        const { client, userId } = this.req.user;
        const { range } = this.req.params;
        try {
            const summary = await this.summaryService.summaryList(client, userId, range);
            return this.res.status(200).json(summary).send();
        } catch (ex) {
            console.error(ex);
            return this.res.status(500).send();
        }
    }

}
