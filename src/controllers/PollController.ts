import { Request, Response } from "express";
import { PollService } from "../services";
import { Controller } from "./Controller";

export class PollController extends Controller {

    private pollService: PollService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.pollService = new PollService();
    }

    public async detailPoll(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const detail = await this.pollService.groupDetailPoll(client, id);
        return this.res.status(200).send(detail);
    }

    public async find(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const [pollStore] = await this.pollService.groupListPoll(client, id);
        return this.res.status(200).send(pollStore);
    }

    public async list(): Promise<Response> {
        const { client } = this.req.user;
        const List = await this.pollService.groupListPoll(client);
        return this.res.status(200).send(List);
    }

    public async answer(): Promise<Response> {
        try {
            const { body } = this.req as { body: [{ id: number, respuesta: string }] };
            const { client } = this.req.user;
            await this.pollService.answerPoll(client, body);
            return this.res.status(200).send();
        } catch (ex) {
            return this.res.status(500).send();
        }
    }

}
