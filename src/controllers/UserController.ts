import { Request, Response } from "express";
import * as request from "request";
import { config } from "../config/config";
import { UserService } from "../services";
import { getEndpoint } from "../services/external/Principal";
import { Controller } from "./Controller";

export class UserController extends Controller {

    private userService: UserService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.userService = new UserService();
    }

    public async Auth() {
        const { userId, password } = this.req.body as { userId: string, password: string };
        if (this.req.body.endpoint) {
            let token: { user: string, token: string };
            try {
                token = await this.userService.validUser(userId, password);
                return this.res.status(200).json({
                    ...token,
                    endpoint: this.req.body.endpoint,
                    km: Number(config.KM),
                }).send();
            } catch (ex) {
                return this.res.status(404).json({ message: ex.message }).send();
            }
        } else {
            const endpoint = await getEndpoint(userId);
            if (endpoint) {
                request(`${endpoint}/auth`, {
                    body: {
                        ...this.req.body,
                        km: Number(this.req.body.km),
                        endpoint,
                    },
                    json: true,
                    method: "POST",
                }, (error, response, body) => {
                    this.res.status(response.statusCode);
                    return this.res.send(body);
                });
            } else {
                return this.res.status(404).json({ message: "No existe el usuario" }).send();
            }
        }

    }

}
