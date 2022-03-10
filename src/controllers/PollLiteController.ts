import { Request, Response } from "express";
import { PollLiteService } from "../services";
import { Controller } from "./Controller";

export class PollLiteController extends Controller {
  private pollLiteService: PollLiteService;

  constructor(req: Request, res: Response) {
    super(req, res);
    this.pollLiteService = new PollLiteService();
  }

  public async detailPoll(): Promise<Response> {
    const id = Number(this.req.params.id);
    const { client } = this.req.user;
    const detail = await this.pollLiteService.groupDetailPoll(client, id);
    return this.res.status(200).send(detail);
  }

  public async find(): Promise<Response> {
    const id = Number(this.req.params.id);
    const { client } = this.req.user;
    const [pollStore] = await this.pollLiteService.groupListPoll(client, id);
    return this.res.status(200).send(pollStore);
  }

  public async list(): Promise<Response> {
    const { client, userId } = this.req.user;
    const List = await this.pollLiteService.groupListPoll(client, null, userId);
    return this.res.status(200).send(List);
  }

  public async answer(): Promise<Response> {
    try {
      const { body } = this.req
      const { fecha, user } = body
      const { form } = body as {
        form: [{ id: number; respuesta: string }];
      };
      const { client } = this.req.user;

      await this.pollLiteService.answerPoll(client, form, fecha, user);
      return this.res.status(200).send();
    } catch (ex) {
      return this.res.status(500).send();
    }
  }
}
