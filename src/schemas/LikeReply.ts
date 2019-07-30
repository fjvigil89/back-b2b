import { number, object } from "joi";

export const createSchema = object().keys({
    reply_id: number().required(),
});

export const listSchema = object().keys({
    id: number().required(),
});
