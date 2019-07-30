import { array, number, string } from "joi";

export const createFeedbackSchema = array().items({
    caseId: number().required(),
    questionId: number().required(),
    folio: number().required(),
    ean: string().required(),
    answer: string().required(),
});
