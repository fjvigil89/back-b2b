import { object, string } from "joi";

export const findSchema = object().keys({
  folio: string().required(),
  version: string().optional(),
});
