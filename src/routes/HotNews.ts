import { HotNewsController } from "../controllers";
import { list } from "../schemas/HotNews";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class HotNewsRouter extends Router {
  constructor() {
    super(HotNewsController);
    this.router.post(
      "/detail",
      [validator(list)],
      this.handler(HotNewsController.prototype.list),
    );
  }
}
