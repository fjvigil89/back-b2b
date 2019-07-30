import { SummaryController } from "../controllers";
import { Router } from "./Router";

export class SummaryRouter extends Router {
    constructor() {
        super(SummaryController);
        this.router
            .get("/:range", [], this.handler(SummaryController.prototype.index));
    }
}
