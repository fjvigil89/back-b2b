import { CheckController } from "../controllers";
import { createSchema } from "../schemas/Check";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class CheckRouter extends Router {
    constructor() {
        super(CheckController);
        this.router
            .post("", validator(createSchema), this.handler(CheckController.prototype.create));
    }
}
