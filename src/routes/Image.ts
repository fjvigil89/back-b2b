import { ImageController } from "../controllers";
import { Router } from "./Router";

var multer = require('multer');

export class ImageRouter extends Router {
    private uploader = multer();
    constructor() {
        super(ImageController);
        this.uploader = multer({ dest: `${__dirname}/../../uploads/` });
        this.router
            .post("", [
                this.uploader.single("image"),
            ], this.handler(ImageController.prototype.create));
    }
}
