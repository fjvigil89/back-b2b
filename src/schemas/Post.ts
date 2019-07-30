import {  number, object, string } from "joi";

export const createSchema = object().keys({
    content: string().required(),
});

export const listSchema = object().keys({
    skip: string().required(),
});

export const findSchema = object().keys({
    id: string().required(),
});

export const listByHashtagSchema = object().keys({
    text: string().required(),
    skip: string().required(),
});

export const updateSchema = object().keys({
    post_id: number().required(),
    content: string().required(),
});
