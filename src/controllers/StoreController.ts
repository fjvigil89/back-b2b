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
    const { userId, client } = this.req.user as {
      userId: string;
      client: string;
    };

    try {
      const Stores = await this.storeService.listStoreUser(client, userId);
      return this.res.status(200).json(Stores);
    } catch (ex) {
      return this.res.status(500).send();
    }
  }

  public async find(): Promise<Response> {
    const folio: string = this.req.params.folio;
    const { client } = this.req.user;
    try {
      const version: string = this.req.params.version;

      let envioVersion = 1;
      if (version) {
        envioVersion = parseInt(version);
      }

      const Stores = await this.storeService.groupStore(
        client,
        Number(folio),
        envioVersion,
      );

      if (Stores) {
        return this.res.status(200).send(Stores);
      } else {
        return this.res.status(404).send();
      }
    } catch (ex) {
      console.error(ex);
      return this.res.status(500).send();
    }
  }
}
