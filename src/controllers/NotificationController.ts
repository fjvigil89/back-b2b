import { Request, Response } from "express";
import { NotificationService } from "../services/Notification";
import { Controller } from "./Controller";

export class NotificationController extends Controller {

    constructor(req: Request, res: Response) {
        super(req, res);
    }

    public async register(): Promise<Response> {
        const { userId, client } = this.req.user as { userId: string, client: string };
        const { token } = this.req.body as { token: string, username: string };
        const notification = new NotificationService();
        try {
            await notification.saveToken(client, userId, token);
            return this.res.status(200).send({ message: "success save token", status: true });
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
