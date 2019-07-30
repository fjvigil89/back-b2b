import { number, object, string } from "joi";

export const createSchema = object().keys({
    folio: number().required(),
    type: string().required(),
}).required();
