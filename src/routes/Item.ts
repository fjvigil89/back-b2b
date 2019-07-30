import { ItemController } from "../controllers";
import { listSchema, listSupiSchema } from "../schemas/Item";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class ItemRouter extends Router {
    constructor() {
        super(ItemController);
        this.router
            .get("/:folio/:category/:action", [ validator(listSchema) ], this.handler(ItemController.prototype.list))
            .get("/supi/:id_visita", [ validator(listSupiSchema) ], this.handler(ItemController.prototype.listSupi));
    }
}
