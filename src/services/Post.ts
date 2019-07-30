import * as moment from "moment";
import { getCustomRepository } from "typeorm";
import { Post } from "../entity";
import { IListPost, PostRepository } from "../repository";
import * as Util from "../utils/service";

interface IImage {
    imageId: number;
    imagePath: string;
}

interface IListPostDetail {
    content: string;
    currentDate: Date | string;
    date: Date | string;
    id: number;
    totalComments: number;
    totalLikes: number;
    userId: string;
    userName: string;
    enableLike: boolean;
    images: IImage[];
}

export class PostService {

    private post: Post;

    constructor() {
        this.post = new Post();
    }

    public createPost(content: string, userId: string): Promise<Post> {
        this.post.content = content;
        this.post.userId = userId;
        this.post.date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return this.post.save()
            .catch((ex) => {
                throw new Error();
            });
    }

    public async updatePost(content: string, postId: number): Promise<void> {
        await Post.update(postId, {
            content,
            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        });
    }

    public findPostDetailByHashtag(text: string, skip: number, userId: string): Promise<IListPostDetail[]> {
        return getCustomRepository(PostRepository).findPostDetailByHashtag(text, skip).then((postsByHashtag) => {
            return this.groupListPosts(postsByHashtag, userId);
        });
    }

    public listPostDetail(skip: number, userId: string): Promise<IListPostDetail[]> {
        return getCustomRepository(PostRepository).findPostDetail(null, skip).then((posts) => {
            return this.groupListPosts(posts, userId);
        });
    }

    public findPostDetail(postId: number, userId: string): Promise<IListPostDetail> {
        return getCustomRepository(PostRepository).findPostDetail(postId).then((post) => {
            return this.groupDetailPost(post, userId);
        });
    }

    private groupListPosts(posts: IListPost[], userId: string): IListPostDetail[] {
        return Util.uniqBy(posts, "id").map((postId) => {
            const postsById = posts.filter((post) => post.id === postId);
            return this.groupDetailPost(postsById, userId);
        });
    }

    private groupDetailPost(postUniqId: IListPost[], userId: string): IListPostDetail {
        const LikesIds = new Set();
        const CommentIds = new Set();
        for (const { likeId, commentId } of postUniqId) {
            if (likeId) {
                LikesIds.add(likeId);
            }
            if (commentId) {
                CommentIds.add(commentId);
            }
        }
        const totalLikes = LikesIds.size;
        const totalComments = CommentIds.size;
        const enableLike = !postUniqId.some((post) => post.idUserLike === userId);
        const images = this.groupImage(postUniqId);
        return {
            content: postUniqId[0].content,
            currentDate: new Date(),
            date: postUniqId[0].date,
            enableLike,
            id: postUniqId[0].id,
            images,
            totalComments,
            totalLikes,
            userId: postUniqId[0].userId,
            userName: postUniqId[0].userName,
        };
    }

    private groupImage(postUniqId: IListPost[]): IImage[] {
        return postUniqId.reduce((acc, current) => {
            if (current.imageId) {
                if (!acc.some((image) => image.imageId === current.imageId)) {
                    acc.push({
                        imageId: current.imageId,
                        imagePath: current.imagePath,
                    });
                }
            }
            return acc;
        }, []);
    }

}
