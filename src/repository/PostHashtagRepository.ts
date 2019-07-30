import { EntityRepository, Repository } from "typeorm";
import { PostHashtag } from "../entity";

@EntityRepository(PostHashtag)
export class PostHashtagRepository extends Repository<PostHashtag> {

    public removeAssociationByPost(postId: number): Promise<void> {
        return this.query(`DELETE FROM post_hashtag WHERE post_id = ${postId}`);
    }

    public removeAssociationByPostHashtag(postId: number, hashtagId: number): Promise<void> {
        return this.query(`DELETE FROM post_hashtag WHERE post_id = ${postId} AND hashtag_id = ${hashtagId}`);
    }

    public findAssociation(postId: number, hashtagId: number): Promise<PostHashtag> {
        return this.findOne({
            where: {
                hashtagId,
                postId,
            },
        });
    }

}
