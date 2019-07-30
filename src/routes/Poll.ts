import { PollController } from "../controllers";
import {  detailPollSchema, findSchema } from "../schemas/Poll";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class PollRouter extends Router {
    constructor() {
        super(PollController);
        this.router
            .get("/store/:id", [ validator(findSchema) ], this.handler(PollController.prototype.find))
            .get("/:id", [ validator(detailPollSchema) ], this.handler(PollController.prototype.detailPoll))
            .get("", [], this.handler(PollController.prototype.list))
            .post("", [], this.handler(PollController.prototype.answer));
    }
}
