import { number, object, string } from "joi";

export const list = object().keys({
  folio: number().required(),
});
