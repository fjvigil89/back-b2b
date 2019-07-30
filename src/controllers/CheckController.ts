import { Request, Response } from "express";
import { CheckService } from "../services";
import { Controller } from "./Controller";

export class CheckController extends Controller {

    private checkService: CheckService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.checkService = new CheckService();
    }

    public async create(): Promise<Response> {
        const { folio, type } = this.req.body as { folio: number, type: string };
        const { userId } = this.req.user as { userId: string };
        try {
            await this.checkService.createCheck(folio, userId, type);
            return this.res.status(200).send();
        } catch (ex) {
            return this.res.status(400).json({ message: ex.message });
        }
    }

}
