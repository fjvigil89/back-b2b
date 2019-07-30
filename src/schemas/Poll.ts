import {  number, object } from "joi";

export const detailPollSchema = object().keys({
    id: number().required(),
});

export const findSchema = object().keys({
    id: number().required(),
});
