import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { LikeReply } from "../entity";
import { LikeReplyService } from "../services";
import { Controller } from "./Controller";

export class LikeReplyController extends Controller {

    private likeReplyService: LikeReplyService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.likeReplyService = new LikeReplyService();
    }

    public async create(): Promise<Response> {
        const { body, user } = this.req as { body: { reply_id: number }, user: { userId: string, client: string } };
        const like = new LikeReply();
        like.replyId = body.reply_id;
        like.userId = user.userId;
        await this.likeReplyService.removeLike(user.client, like);
        return getConnection(user.client).getRepository(LikeReply).save(like)
            .then((newLike) => {
                return this.res.status(200).json({ like: newLike }).send();
            })
            .catch((ex) => {
                return this.res.status(200).json({ message: "Hubo un error al crear el like" }).send();
            });
    }

    public async list(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const likes = await this.likeReplyService.findByReply(client, id);
        return this.res.status(200).json({ likes }).send();
    }

    public async remove(): Promise<Response> {
        const { id } = this.req.params;
        const { client } = this.req.user;
        const like = new LikeReply();
        like.replyId = Number(id);
        like.userId = this.req.user.userId;
        return this.likeReplyService.removeLike(client, like)
            .then(() => {
                return this.res.status(200).send();
            })
            .catch((ex) => {
                return this.res.status(200).json({ message: "Hubo un error al eliminar el like" }).send();
            });
    }

}
