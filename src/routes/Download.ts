import { DownloadController } from "../controllers";
import { Router } from "./Router";

export class DownloadRouter extends Router {
    constructor() {
        super(DownloadController);
        this.router
            .get("", this.handler(DownloadController.prototype.getDataReport));
    }
}
