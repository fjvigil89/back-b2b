import { Request, Response } from "express";
import { ItemService } from "../services";
import { tomaVisita } from "../services/external/SUPI";
import { Controller } from "./Controller";

export class ItemController extends Controller {

    private itemService: ItemService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.itemService = new ItemService();
    }

    public async list(): Promise<Response> {
        const { folio, category, action } = this.req.params as { folio: string, category: string, action: string };
        const { client } = this.req.user;
        try {
            const detail = await this.itemService.detailItemsAction(client, Number(folio), category, action);
            return this.res.status(200).send({ detail });
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

    public async listSupi(): Promise<Response> {
        const { id_visita } = this.req.params;
        const Items = await tomaVisita(id_visita);
        return this.res.status(200).json({ Items }).send();
    }

}
