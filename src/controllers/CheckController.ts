import { Request, Response } from "express";
import { CheckService } from "../services";
import { Controller } from "./Controller";

export class CheckController extends Controller {
  private checkService: CheckService;

  constructor(req: Request, res: Response) {
    super(req, res);
    this.checkService = new CheckService();
  }

  public async create(): Promise<Response> {
    const { folio, type } = this.req.body;
    const { userId, client } = this.req.user;

    try {
      await this.checkService.createCheck(client, folio, userId, type);
      return this.res.status(200).send();
    } catch (ex) {
      console.error("/check: ", ex);
      return this.res.status(500).json({ message: ex.message });
    }
  }

  public async validateCheckIn(): Promise<Response> {
    const { folio } = this.req.body;
    const { userId, client } = this.req.user;

    try {
      let response = await this.checkService.validateCheckIn(
        client,
        folio,
        userId,
      );

      return this.res.status(200).json({ check: response }).send();
    } catch (ex) {
      console.error("/check: ", ex);
      return this.res.status(500).json({ message: ex.message });
    }
  }
}
