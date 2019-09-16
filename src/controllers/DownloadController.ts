import { Request, Response } from "express";
import { DownloadService } from "../services";
import { Controller } from "./Controller";

export class DownloadController extends Controller {
  private downloadService: DownloadService;

  constructor(req: Request, res: Response) {
    super(req, res);
    this.downloadService = new DownloadService();
  }

  public async getDataReport(): Promise<Response> {
    const { body, user } = this.req;

    // Obtene datos
    const datos = await this.downloadService.getDataDownload(user.client, body);

    // Comprimir o entregar
    return this.res.status(200).json({ datos }).send();
  }
}
