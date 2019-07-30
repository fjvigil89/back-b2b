import * as multer from "multer";
import { PostController } from "../controllers";
import {
    createSchema,
    findSchema,
    listByHashtagSchema,
    listSchema,
    updateSchema,
} from "../schemas/Post";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class PostRouter extends Router {
    private uploader: multer.Instance;
    constructor() {
        super(PostController);
        this.uploader = multer({ dest: `${__dirname}/../../uploads/` });
        this.router
            .post("", [
                this.uploader.array("images", 50),
                validator(createSchema),
            ], this.handler(PostController.prototype.create))
            .get("/hashtag/:text/skip/:skip", [
                validator(listByHashtagSchema),
            ], this.handler(PostController.prototype.listByHashtag))
            .get("/hashtag/:text", [], this.handler(PostController.prototype.listByHashtag))
            .get("/:id", [
                validator(findSchema),
            ], this.handler(PostController.prototype.find))
            .get("/skip/:skip", [
                validator(listSchema),
            ], this.handler(PostController.prototype.list))
            .get("", [], this.handler(PostController.prototype.list))
            .delete("/:id", this.handler(PostController.prototype.remove))
            .put("", [
                this.uploader.array("images", 50),
                validator(updateSchema),
            ], this.handler(PostController.prototype.update));
    }
}
