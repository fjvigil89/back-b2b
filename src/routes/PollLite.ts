import { PollLiteController } from "../controllers";
import {  detailPollSchema, findSchema } from "../schemas/Poll";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class PollLiteRouter extends Router {
    constructor() {
        super(PollLiteController);
        this.router
            .get("/store/:id", [ validator(findSchema) ], this.handler(PollLiteController.prototype.find))
            .get("/:id", [ validator(detailPollSchema) ], this.handler(PollLiteController.prototype.detailPoll))
            .get("", [], this.handler(PollLiteController.prototype.list))
            .post("", [], this.handler(PollLiteController.prototype.answer));
    }
}
