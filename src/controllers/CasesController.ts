import { Request, Response } from "express";
import * as moment from "moment";
import { Case, CaseFeedback } from "../entity";
import { CaseFeedbackService, CasesService, ImageService } from "../services";
import { Controller } from "./Controller";

interface ICaseRequest {
    folio: number;
    action: string;
    cause: string;
    ean: string;
    ventaPerdida: number;
    dateB2B: string;
}

interface ICaseFeedback {
    caseId: number;
    questionId: number;
    folio: number;
    ean: string;
    answer: string;
}

export class CasesController extends Controller {

    private caseService: CasesService;
    private caseFeedbackService: CaseFeedbackService;
    private imageservice: ImageService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.caseService = new CasesService();
        this.caseFeedbackService = new CaseFeedbackService();
        this.imageservice = new ImageService();
    }

    public async create(): Promise<Response> {
        try {
            const newCase = this.req.body as ICaseRequest;
            const createdCase = Case.create({
                ...newCase,
                dateAction: moment().format("YYYY-MM-DD"),
                userId: this.req.user.userId,
            });
            const caseId = await this.caseService.create(createdCase);
            return this.res.status(200).send({ success: true, caseId });
        } catch (ex) {
            console.error(ex);
            return this.res.status(400).send();
        }
    }

    public async createFeedback(): Promise<Response> {
        const {casesFeedback, images} = this.req.body; //  as ICaseFeedback[];
        try {
            const createFeedback = [];
            for (const feedback of casesFeedback) {
                if (images.base64 && feedback.questionId === 0) {
                    feedback.answer = images.name;
                }
                const createdCaseFeedback = CaseFeedback.create({
                    ...feedback,
                    date: moment().format("YYYY-MM-DD"),
                });
                createFeedback.push(this.caseFeedbackService.create(createdCaseFeedback));
            }

            await Promise.all(createFeedback);

            if (images.base64) {
                // Save image
                const content = images.base64;
                const name = images.name;
                const resultUpload = await this.imageservice.base64UploadToS3(content, name);
            }

            return this.res.status(200).send({ success: true, message: "Case feedback almacenado con exito" });
        } catch (err) {
            console.error("Error when save Case Feedback: ", err);
            return this.res.status(400).send();
        }
    }

}
