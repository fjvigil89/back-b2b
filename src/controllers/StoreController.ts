import { Request, Response } from "express";
import { StoreService } from "../services";
import { Controller } from "./Controller";

export class StoreController extends Controller {

    private storeService: StoreService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.storeService = new StoreService();
    }

    public async list(): Promise<Response> {
        const { userId } = this.req.user as { userId: string };
        try {
            const Stores = await this.storeService.listStoreUser(userId);
            return this.res.status(200).json(Stores).send();
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

    public async find(): Promise<Response> {
        const folio: string = this.req.params.folio;
        try {
            const Stores = await this.storeService.groupStore(Number(folio));
            if (Stores) {
                return this.res.status(200).json(Stores).send();
            } else {
                return this.res.status(404).send();
            }
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

}
