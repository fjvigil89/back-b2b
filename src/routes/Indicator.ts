import { IndicadorController } from "../controllers/IndicatorController";

import { list } from "../schemas/IndicatorSchema";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class IndicadorRouter extends Router {
  constructor() {
    super(IndicadorController);
    this.router.post(
      "/all",
      [],
      this.handler(IndicadorController.prototype.list),
    );
    this.router.post(
      "/test",
      [],
      this.handler(IndicadorController.prototype.test),
    );
  }
}
