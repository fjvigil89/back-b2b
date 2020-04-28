import * as multer from "multer";
import { CommentController } from "../controllers";
import { createSchema, findSchema, listSchema, updateSchema } from "../schemas/Comment";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class CommentRouter extends Router {
    private upload = multer();
    constructor() {
        super(CommentController);
        this.upload = multer({ dest: `${__dirname}/../../uploads/` });
        this.router
            .post("", [
                this.upload.single("image"), validator(createSchema),
            ], this.handler(CommentController.prototype.create))
            .put("", validator(updateSchema), this.handler(CommentController.prototype.update))
            .get("/post/:id", validator(findSchema), this.handler(CommentController.prototype.list))
            .get("/:id", validator(listSchema), this.handler(CommentController.prototype.find))
            .delete("/:id", this.handler(CommentController.prototype.remove));
    }
}
