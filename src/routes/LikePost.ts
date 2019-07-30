import { LikePostController } from "../controllers";
import { createSchema, listSchema } from "../schemas/LikePost";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class LikePostRouter extends Router {
    constructor() {
        super(LikePostController);
        this.router
            .post("", [ validator(createSchema) ], this.handler(LikePostController.prototype.create))
            .delete("/:id", [ ], this.handler(LikePostController.prototype.remove))
            .get("/post/:id", [ validator(listSchema) ], this.handler(LikePostController.prototype.list));
    }
}
