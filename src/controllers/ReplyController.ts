import { Request, Response } from "express";
import * as moment from "moment";
import { getConnection } from "typeorm";
import { Comment, Reply } from "../entity";
import { HashtagService, ImageService, ReplyService } from "../services";
import { Controller } from "./Controller";

export class ReplyController extends Controller {

    private imageService: ImageService;
    private hashtagService: HashtagService;
    private replyService: ReplyService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.imageService = new ImageService();
        this.hashtagService = new HashtagService();
        this.replyService = new ReplyService();
    }

    public async create(): Promise<Response> {
        const { body, user } = this.req;
        const reply = new Reply();
        reply.content = body.content;
        reply.commentId = body.comment_id;
        reply.userId = user.userId;
        reply.date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if (this.req.file) {
            reply.image = await this.imageService.saveOneImage(user.client, this.req.file);
        }
        const { postId } = await Comment.findOne(reply.commentId);
        await this.hashtagService.associatePostHashtag(user.client, postId, reply.content, false);

        return getConnection(user.client).getRepository(Reply).save(reply)
            .then((newReply) => {
                newReply.date = moment(newReply.date).toISOString();
                return this.res.status(200).json({ reply: newReply }).send();
            })
            .catch((ex) => {
                return this.res.status(200).json({ message: "Hubo un error al crear la respuesta" }).send();
            });
    }

    public async list(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const replies = await this.replyService.findByComment(client, id);
        return this.res.status(200).json({ replies }).send();
    }

    public async find(): Promise<Response> {
        const id = Number(this.req.params.id);
        const reply = await Reply.findOne(id);
        if (reply) {
            return this.res.status(200).json({ reply }).send();
        } else {
            return this.res.status(404).json({ message: "Respuesta no encontrado" }).send();
        }
    }

    public async update(): Promise<Response> {
        const { reply_id, content } = this.req.body as { reply_id: number, content: string };
        const { client } = this.req.user;
        return this.replyService.updateReply(client, content, reply_id)
            .then(() => {
                return this.res.status(200).send();
            })
            .catch(() => {
                return this.res.status(404).json({ message: "Error al actualizar el comentario" }).send();
            });
    }

    public async remove(): Promise<Response> {
        const id = Number(this.req.params.id);
        await Reply.delete(id);
        return this.res.status(200).send();
    }

}
