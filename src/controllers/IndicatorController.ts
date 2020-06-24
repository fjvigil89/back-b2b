import { Request, Response } from "express";
import { IndicadorService } from "../services";
import * as b2bService from "../services/external/B2B";
import { Controller } from "./Controller";

export class IndicadorController extends Controller {
  private indicadorService: IndicadorService;

  constructor(req: Request, res: Response) {
    super(req, res);
    this.indicadorService = new IndicadorService();
  }

  public async list(): Promise<Response> {
    const { client } = this.req.user;
    const { folio } = this.req.body as {
      folio: number;
    };
    try {
      console.log("client", client);
      let data;
      if (client.length) {
        data = await this.indicadorService.getIndicatorByFolio(client, folio);
      }
      return this.res.status(200).send({ data });
    } catch (err) {
      console.log(err);
      return this.res.status(500).send();
    }
  }

  public async test(): Promise<Response> {
    try {
      const { client } = this.req.user;
      const { folio } = this.req.body as {
        folio: number;
      };
      console.log("folio", folio);
      const data = await this.indicadorService.getIndicatorByFolioTest();
      // const data = Object.keys(res[0]).map((indicador) => {
      //   console.log("data", res);
      //   return res[0][indicador];
      // });

      return this.res.status(200).send({ data });
    } catch (err) {
      return this.res.status(500).send();
    }
  }
}
