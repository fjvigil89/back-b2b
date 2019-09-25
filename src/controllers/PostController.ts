import { Request, Response } from "express";
import { Post } from "../entity";
import { HashtagService, ImageService, PostService } from "../services";
import { Controller } from "./Controller";

export class PostController extends Controller {

    private hashtagService: HashtagService;
    private imageService: ImageService;
    private postService: PostService;

    constructor(req: Request, res: Response) {
        super(req, res);
        this.hashtagService = new HashtagService();
        this.imageService = new ImageService();
        this.postService = new PostService();
    }

    public async create(): Promise<Response> {
        const { body, user } = this.req;
        let post: Post;
        try {
            post = await this.postService.createPost(user.client, body.content, user.userId);
            await this.hashtagService.associatePostHashtag(user.client, post.id, post.content);
            if (Array.isArray(this.req.files)) {
                await this.imageService.saveImages(this.req.user.client, this.req.files, post.id);
            }
            const postGroup = await this.postService.findPostDetail(user.client, post.id, user.userId);
            return this.res.status(200).json({ post: postGroup }).send();
        } catch (ex) {
            return this.res.status(500).json({ message: "Hubo un error al crear el post" }).send();
        }
    }

    public async list(): Promise<Response> {
        const { skip } = this.req.params as { skip: string };
        const { client } = this.req.user;
        const postsGroup = await this.postService.listPostDetail(client, Number(skip), this.req.user.userId);
        return this.res.status(200).send({ posts: postsGroup });
    }

    public async find(): Promise<Response> {
        const id = Number(this.req.params.id);
        const { client } = this.req.user;
        const post = await this.postService.findPostDetail(client, id, this.req.user.userId);
        if (post) {
            return this.res.status(200).json({ post }).send();
        } else {
            return this.res.status(404).json({ message: "Post no encontrado" }).send();
        }
    }

    public async listByHashtag(): Promise<Response> {
        const { text, skip } = this.req.params as { text: string, skip: string };
        const { client } = this.req.user;
        const postsByHashtag = await this.postService.findPostDetailByHashtag(client, text, Number(skip), this.req.user.userId);
        return this.res.status(200).json({ posts: postsByHashtag }).send();
    }

    public async update(): Promise<Response> {
        const { post_id, content } = this.req.body as { post_id: number, content: string };
        const { client } = this.req.user;
        try {
            await this.postService.updatePost(client, content, post_id);
            await this.hashtagService.associatePostHashtag(client, post_id, content);
            if (Array.isArray(this.req.files)) {
                await this.imageService.saveImages(client, this.req.files, post_id);
            }
            return this.res.status(200).send();
        } catch (ex) {
            return this.res.status(500).json({ message: "Error al actualizar el post" }).send();
        }
    }

    public async remove(): Promise<Response> {
        const { id } = this.req.params;
        await Post.delete(id);
        return this.res.status(200).send();
    }

}
