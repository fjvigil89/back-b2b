import { number, object, string } from "joi";

export const listSchema = object().keys({
    folio: string().required(),
    category: string().required(),
    action: string().required(),
});

export const listSupiSchema = object().keys({
    id_visita: number().required(),
});
