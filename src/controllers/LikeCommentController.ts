import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { LikeComment } from "../entity";
import { LikeCommentService } from "../services";
import { Controller } from "./Controller";

export class LikeCommentController extends Controller {

    private likeCommentService: LikeCommentService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.likeCommentService = new LikeCommentService();
    }

    public async create(): Promise<Response> {
        const { body, user } = this.req;
        const like = new LikeComment();
        like.commentId = body.comment_id;
        like.userId = user.userId;
        await this.likeCommentService.removeLike(this.req.user.client, like);

        return getConnection(user.client).getRepository(LikeComment).save(like)
            .then((newLike) => {
                return this.res.status(200)
                    .json({ like: newLike }).send();
            })
            .catch((ex) => {
                return this.res.status(200)
                    .json({
                        message: "Hubo un error al crear el like",
                    }).send();
            });
    }

    public async list(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const likes = await this.likeCommentService.findByComment(client, id);
        return this.res.status(200).json({ likes }).send();
    }

    public async remove(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const like = new LikeComment();
        like.commentId = id;
        like.userId = this.req.user.userId;
        return this.likeCommentService.removeLike(client, like)
            .then(() => {
                return this.res.status(200).send();
            })
            .catch((ex) => {
                return this.res.status(200)
                    .json({
                        message: "Hubo un error al eliminar el like",
                    }).send();
            });
    }

}
