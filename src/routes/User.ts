import { UserController } from "../controllers";
import { Router } from "./Router";

export class UserRouter extends Router {
    constructor() {
        super(UserController);
        this.router
            .post("", this.handler(UserController.prototype.Auth));
    }
}
