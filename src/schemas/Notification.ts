import { object, string } from "joi";

export const createSchema = object().keys({
    token: string().required(),
    username: string().required(),
}).required();
