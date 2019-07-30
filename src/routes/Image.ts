import * as multer from "multer";
import { ImageController } from "../controllers";
import { Router } from "./Router";

export class ImageRouter extends Router {
    private uploader: multer.Instance;
    constructor() {
        super(ImageController);
        this.uploader = multer({ dest: `${__dirname}/../../uploads/` });
        this.router
            .post("", [
                this.uploader.single("image"),
            ], this.handler(ImageController.prototype.create));
    }
}
