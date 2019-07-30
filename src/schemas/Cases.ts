import { number, object, string } from "joi";

export const createSchema = object().keys({
    folio: number().required(),
    action: string().required(),
    cause: string().required(),
    ean: string().required(),
    ventaPerdida: number().required(),
    dateB2B: string().required(),
}).required();
