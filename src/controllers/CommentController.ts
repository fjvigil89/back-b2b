import { Request, Response } from "express";
import * as moment from "moment";
import { getConnection } from "typeorm";
import { Comment } from "../entity";
import { CommentService, HashtagService, ImageService } from "../services";
import { Controller } from "./Controller";

export class CommentController extends Controller {

    private imageService: ImageService;
    private commentService: CommentService;
    private comment: Comment;
    private hashtagService: HashtagService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.imageService = new ImageService();
        this.commentService = new CommentService();
        this.comment = new Comment();
        this.hashtagService = new HashtagService();
    }

    public async create(): Promise<Response> {
        const { body, user, file } = this.req as {
            body: { content: string, post_id: number }, user: { userId: string, client: string }, file?: Express.Multer.File,
        };
        this.comment.content = body.content;
        this.comment.postId = Number(body.post_id);
        this.comment.userId = user.userId;
        this.comment.date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        if (file) {
            this.comment.image = await this.imageService.saveOneImage(this.req.user.client, file);
        }
        await this.hashtagService.associatePostHashtag(user.client, this.comment.postId, this.comment.content, false);

        return getConnection(user.client).getRepository(Comment).save(this.comment)
            .then(() => {
                this.comment.date = moment(this.comment.date).toISOString();
                return this.res.status(200).json({ comment: this.comment }).send();
            })
            .catch((ex) => {
                return this.res.status(200).json({ message: "Hubo un error al crear el comentario" }).send();
            });
    }

    public async list(): Promise<Response> {
        const { id } = this.req.params as { id: number, user: { userId: string } };
        const ListGroupComments = await this.commentService.listGroupCommentDetail(this.req.user.client, id, this.req.user.userId);
        return this.res.status(200).json({ comments: ListGroupComments }).send();
    }

    public async find(): Promise<Response> {
        const { id } = this.req.params as { id: number };
        const { client } = this.req.user;
        const ListGroupComments = await this.commentService.detailComment(client, id, this.req.user.userId);
        if (ListGroupComments) {
            return this.res.status(200).json({ comment: ListGroupComments }).send();
        } else {
            return this.res.status(404).json({ message: "Comentario no encontrado" }).send();
        }
    }

    public async update(): Promise<Response> {
        const { comment_id, content } = this.req.body as { comment_id: number, content: string };
        const { client } = this.req.user;
        return getConnection(client).getRepository(Comment).update(comment_id, {
            content,
            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
            .then(() => {
                return this.res.status(200).send();
            })
            .catch(() => {
                return this.res.status(404).json({ message: "Error al actualizar el comentario" }).send();
            });
    }

    public async remove(): Promise<Response> {
        const { id } = this.req.params as { id: number };
        await Comment.delete(id);
        return this.res.status(200).send();
    }

}
