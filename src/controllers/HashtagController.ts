import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Hashtag } from "../entity";
import { Controller } from "./Controller";

export class HashtagController extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async list(): Promise<Response> {
        const { client } = this.req.user;
        const hashtags = await getConnection(client).getRepository(Hashtag).find();
        return this.res.json({ hashtags });
    }

}
