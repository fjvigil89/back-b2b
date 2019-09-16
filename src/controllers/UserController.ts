import { Request, Response } from "express";
import { config } from "../config/config";
import { UserService } from "../services";
import { Controller } from "./Controller";

export class UserController extends Controller {

    private userService: UserService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.userService = new UserService();
    }

    public async Auth() {
        try {
            const { userId, password } = this.req.body as { userId: string, password: string };
            let token: { user: string, token: string };
            token = await this.userService.validUser(userId, password);
            return this.res.status(200).json({
                ...token,
                endpoint: "http://back-b2b-production.sditrmidsj.us-west-2.elasticbeanstalk.com",
                km: Number(config.KM),
            }).send();
        } catch (err) {
            console.error(err);
            return this.res.status(404).json({ message: "No existe el usuario" }).send();
        }
    }

}
