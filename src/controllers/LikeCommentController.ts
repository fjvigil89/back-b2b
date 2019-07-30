import { Request, Response } from "express";
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
        const { body, user } = this.req as { body: { comment_id: number }, user: { userId: string } };
        const like = new LikeComment();
        like.commentId = body.comment_id;
        like.userId = user.userId;
        await this.likeCommentService.removeLike(like);
        return like.save()
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
        const { id } = this.req.params as { id: number };
        const likes = await this.likeCommentService.findByComment(id);
        return this.res.status(200).json({ likes }).send();
    }

    public async remove(): Promise<Response> {
        const { id } = this.req.params as { id: number };
        const like = new LikeComment();
        like.commentId = id;
        like.userId = this.req.user.userId;
        return this.likeCommentService.removeLike(like)
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
