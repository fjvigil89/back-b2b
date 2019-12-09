import { NotificationController } from "../controllers";
import { createSchema } from "../schemas/Notification";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class NotificationRouter extends Router {
    constructor() {
        super(NotificationController);
        this.router
            .post("/token", validator(createSchema), this.handler(NotificationController.prototype.register))
            .post("/send"/* , validator(createSchema) */, this.handler(NotificationController.prototype.send));
    }
}
