import { Request, Response } from "express";
import { ImageService } from "../services";
import { Controller } from "./Controller";

export class ImageController extends Controller {

    private imageService: ImageService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.imageService = new ImageService();
    }

    public async create(): Promise<Response> {
        const { context, id } = this.req.body as { context: string, id: string };
        const { client } = this.req.user;
        try {
            let url: string;
            if (this.req.file) {
                url = await this.imageService.saveOneImage(client, this.req.file, `${context}/${id}`);
            }
            return this.res.status(200).json({ url }).send();
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

}
