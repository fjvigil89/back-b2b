import { object, string } from "joi";

export const AuthSchema = object().keys({
    userId: string().required(),
    password: string().required(),
});
