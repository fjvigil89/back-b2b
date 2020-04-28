import { VentasController } from "../controllers";
import { ventaSchema } from "../schemas/Ventas";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";

export class VentasRouter extends Router {
    constructor() {
        super(VentasController);
        this.router
            .post("/tiendas", [ validator(ventaSchema) ], this.handler(VentasController.prototype.list));
    }
}
