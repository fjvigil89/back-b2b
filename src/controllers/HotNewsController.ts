import { Request, Response } from "express";
import { HotNewsService } from "../services";
import { Controller } from "./Controller";

export class HotNewsController extends Controller {
  private hotNewsService: HotNewsService;
  constructor(req: Request, res: Response) {
    super(req, res);
    this.hotNewsService = new HotNewsService();
  }

  public async list(): Promise<Response> {
    const { client } = this.req.user;
    const { bandera, cod_local, retail } = this.req.body as {
      bandera: string;
      cod_local: string;
      retail: string;
    };
    try {
      const data = await this.hotNewsService.getAcComercialAndCatalogos(
        client,
        cod_local,
        retail,
        bandera,
      );
      console.log("data", data);
      return this.res.status(200).send({
        data: data,
        success: true,
        mensaje: "Información para hotnews enviada correctamente",
      });
    } catch (err) {
      return this.res.status(500).send({ success: false, mensaje: err });
    }
  }
}
