import { CasesController } from "../controllers";
import { createSchema } from "../schemas/Cases";
import { Router } from "./Router";
import { validator } from "./SchemaValidator";
// import { createFeedbackSchema } from '../schemas/CaseFeedback.schema';

export class CasesRouter extends Router {
    constructor() {
        super(CasesController);
        this.router
            .post("", validator(createSchema), this.handler(CasesController.prototype.create))
            .post("/feedback"
                /* , validator(createFeedbackSchema) */,
                this.handler(CasesController.prototype.createFeedback));
    }
}
