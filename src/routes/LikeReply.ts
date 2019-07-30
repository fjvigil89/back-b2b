import { LikeReplyController } from "../controllers";
import { createSchema, listSchema } from "../schemas/LikeReply";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class LikeReplyRouter extends Router {
    constructor() {
        super(LikeReplyController);
        this.router
            .post("", [ validator(createSchema) ], this.handler(LikeReplyController.prototype.create))
            .delete("/:id", [ ], this.handler(LikeReplyController.prototype.remove))
            .get("/reply/:id", [ validator(listSchema) ], this.handler(LikeReplyController.prototype.list));
    }
}
