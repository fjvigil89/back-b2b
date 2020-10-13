import { ReplyController } from "../controllers";
import { createSchema, findSchema, listSchema, updateSchema } from "../schemas/Reply";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

var multer = require('multer');

export class ReplyRouter extends Router {
    private uploader = multer();
    constructor() {
        super(ReplyController);
        this.uploader = multer({ dest: `${__dirname}/../../uploads/` });
        this.router
            .post("", [
                this.uploader.single("image"),
                validator(createSchema),
            ], this.handler(ReplyController.prototype.create))
            .put("", [
                validator(updateSchema),
            ], this.handler(ReplyController.prototype.update))
            .get("/comment/:id", [
                validator(listSchema),
            ], this.handler(ReplyController.prototype.list))
            .get("/:id", [
                validator(findSchema),
            ], this.handler(ReplyController.prototype.find))
            .delete("/:id", this.handler(ReplyController.prototype.remove));
    }
}
