import { LikeCommentController } from "../controllers";
import { createSchema, listSchema } from "../schemas/LikeComment";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class LikeCommentRouter extends Router {
    constructor() {
        super(LikeCommentController);
        this.router
            .post("", [ validator(createSchema) ], this.handler(LikeCommentController.prototype.create))
            .delete("/:id", [ ], this.handler(LikeCommentController.prototype.remove))
            .get("/comment/:id", [ validator(listSchema) ], this.handler(LikeCommentController.prototype.list));
    }
}
