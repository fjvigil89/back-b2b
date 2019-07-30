import {  number, object, string } from "joi";

export const createSchema = object().keys({
    content: string().required(),
    comment_id: number().required(),
});

export const listSchema = object().keys({
    id: number().required(),
});

export const findSchema = object().keys({
    id: number().required(),
});

export const updateSchema = object().keys({
    reply_id: number().required(),
    content: string().required(),
});
