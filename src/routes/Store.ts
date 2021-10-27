import { StoreController } from "../controllers";
import { findSchema } from "../schemas/Store";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class StoreRouter extends Router {
  constructor() {
    super(StoreController);
    this.router
      .get("", [], this.handler(StoreController.prototype.list))
      .get("/list/v2", [], this.handler(StoreController.prototype.listV2))
      .get(
        "/:folio",
        [validator(findSchema)],
        this.handler(StoreController.prototype.find),
      )
      .get(
        "/:folio/:version",
        [validator(findSchema)],
        this.handler(StoreController.prototype.find),
      )
      .get(
        "/offline/:folio/:version",
        [],
        this.handler(StoreController.prototype.findOffline),
      );
  }
}
