import { Request, Response } from "express";
import { Hashtag } from "../entity";
import { Controller } from "./Controller";

export class HashtagController extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async list(): Promise<Response> {
        const hashtags = await Hashtag.find();
        return this.res.json({ hashtags });
    }

}
