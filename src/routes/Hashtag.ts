import { HashtagController } from "../controllers";
import { Router } from "./Router";

export class HashtagRouter extends Router {
    constructor() {
        super(HashtagController);
        this.router
            .get("", [], this.handler(HashtagController.prototype.list));
    }
}
