import { object, string } from "joi";

export const list = object().keys({
  retail: string().required(),
  cod_local: string().required(),
  bandera: string().required(),
});
