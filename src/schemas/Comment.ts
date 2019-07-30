import { number, object, string } from "joi";

export const createSchema = object().keys({
    content: string().required(),
    post_id: number().required(),
}).required();

export const listSchema = object().keys({
    id: number().required(),
}).required();

export const findSchema = object().keys({
    id: number().required(),
}).required();

export const updateSchema = object().keys({
    comment_id: number(),
    content: string(),
}).required();
