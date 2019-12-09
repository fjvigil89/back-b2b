import { Request, Response } from "express";
import { Controller } from "./Controller";

export class NotificationController extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async register(): Promise<Response> {
        const { token, username } = this.req.body as { token: string, username: string };
        try {
            console.log(token);
            console.log(username);
            return this.res.status(200).send({ message: "success token", status: true });
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

    public async send(): Promise<Response> {
        const { message } = this.req.body as { message: string };
        try {
            console.log(message);
            return this.res.status(200).send({ message: "success message", status: true });
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

}
