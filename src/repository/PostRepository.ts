import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entity";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {

    public findPostDetailByHashtag(text: string, skip: number): Promise<IListPost[]> {
        return this.query(`SELECT a.userName, c.id as likeId, d.id as commentId, a.content,
        a.date, a.id, a.userId, g.id as imageId, g.path as imagePath FROM (
        SELECT d.name as userName, a.content as content, a.date as date, a.id as id, d.id as userId FROM post a
        INNER JOIN post_hashtag b ON
        a.id = b.post_id
        INNER JOIN hashtag c ON
        b.hashtag_id = c.id
        INNER JOIN user d ON
        a.user_id = d.id
        WHERE c.text = "#${text}" ${skip ? `AND a.id < ${skip}` : ``}
        ORDER by a.date DESC LIMIT 10
        ) as a
        LEFT JOIN like_post c ON
        c.post_id = a.id
        LEFT JOIN comment d ON
        a.id = d.post_id
        LEFT JOIN image g ON a.id = g.post_id`);
    }

    public findPostDetail(postId?: number, skip?: number): Promise<IListPost[]> {
        return this.query(`SELECT b.name as userName, c.id as likeId, c.user_id as idUserLike,
        d.id as commentId, a.content as content,
        a.date as date, a.id as id, b.id as userId, e.id as imageId, e.path as imagePath
        FROM (SELECT * FROM post ${postId ? `WHERE id = ${postId}` : `${skip ? `WHERE id < ${skip}` : ``}`}
        GROUP BY id ORDER BY date DESC LIMIT 10) a
        INNER JOIN user b
        ON a.user_id = b.id
        LEFT JOIN like_post c
        ON c.post_id = a.id
        LEFT JOIN comment d
        ON a.id = d.post_id
        LEFT JOIN image e ON
        a.id = e.post_id
        ORDER BY a.date DESC`);
    }

}
