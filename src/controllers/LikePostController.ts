import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { LikePost } from "../entity";
import { LikePostService } from "../services";
import { Controller } from "./Controller";

export class LikePostController extends Controller {

    private likePostService: LikePostService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.likePostService = new LikePostService();
    }

    public async create(): Promise<Response> {
        const { body, user } = this.req as { body: { post_id: number }, user: { userId: string, client: string } };
        const like = new LikePost();
        like.postId = body.post_id;
        like.userId = user.userId;
        await this.likePostService.removeLike(user.client, like);

        return getConnection(user.client).getRepository(LikePost).save(like)
            .then((newLike) => {
                return this.res.status(200).json({ like: newLike }).send();
            })
            .catch((ex) => {
                return this.res.status(200).json({ message: "Hubo un error al crear el like" }).send();
            });
    }

    public async list(): Promise<Response> {
        const { id } = this.req.params as { id: number };
        const { client } = this.req.user;
        const likes = await this.likePostService.findByPost(client, id);
        return this.res.status(200).json({ likes }).send();
    }

    public async remove(): Promise<Response> {
        const { id } = this.req.params as { id: number };
        const { client } = this.req.user;
        const like = new LikePost();
        like.postId = id;
        like.userId = this.req.user.userId;
        return this.likePostService.removeLike(client, like)
            .then(() => {
                return this.res.status(200).send();
            })
            .catch((ex) => {
                return this.res.status(200).json({ message: "Hubo un error al eliminar el like" }).send();
            });
    }

}
