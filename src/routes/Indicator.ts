import { IndicadorController } from "../controllers/IndicatorController";

import { list } from "../schemas/IndicatorSchema";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class IndicadorRouter extends Router {
  constructor() {
    super(IndicadorController);
    this.router.post(
      "/all",
      [validator(list)],
      this.handler(IndicadorController.prototype.list),
    );
  }
}
