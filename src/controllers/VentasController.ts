import { Request, Response } from "express";
import { VentasService } from "../services";
import { Controller } from "./Controller";

export class VentasController extends Controller {

    private ventasService: VentasService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.ventasService = new VentasService();
    }

    public async list(): Promise<Response> {
        const { cod_local, retail } = this.req.body as { cod_local: string, retail: string };
        const { client } = this.req.user;

        try {
            const detail = await this.ventasService.getInformation(client, cod_local, retail);

            return this.res.status(200).send({ detail });
        } catch (ex) {
            return this.res.status(500).send();
        }
    }
}
