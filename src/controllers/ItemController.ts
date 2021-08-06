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
    const { folio, category, action, version } = this.req.params as {
      folio: string;
      category: string;
      action: string;
      version: string;
    };
    const { client } = this.req.user;
    try {
      let accionTemp = action;
      if (!version) {
        if (accionTemp == "Reponer") {
          accionTemp = "Revisar";
        }
      }

      const detail = await this.itemService.detailItemsAction(
        client,
        Number(folio),
        category,
        accionTemp,
      );

      return this.res.status(200).send({ detail });
    } catch (ex) {
      return this.res.status(500).send();
    }
  }

  public async listSupi(): Promise<Response> {
    const idVisita = Number(this.req.params.id_visita);
    const Items = await tomaVisita(idVisita);
    return this.res.status(200).json({ Items }).send();
  }
}
