import { object, string } from "joi";

export const ventaSchema = object().keys({
    cod_local: string().required(),
    retail: string().required(),
});
