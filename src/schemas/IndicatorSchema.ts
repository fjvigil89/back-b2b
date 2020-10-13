import { number, object, string } from "joi";

export const list = object().keys({
  cliente: string().required(),
  folio: number().required(),
});
