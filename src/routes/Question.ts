import { QuestionController } from "../controllers";
import { Router } from "./Router";

export class QuestionRouter extends Router {
    constructor() {
        super(QuestionController);
        this.router
            .get("", this.handler(QuestionController.prototype.list));
    }
}
