import { EntityRepository, Repository } from "typeorm";
import { Image } from "../entity";

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {

    public clearImagesByPost(postId: number): Promise<void> {
        return this.query(`DELETE FROM image WHERE post_id = ${postId}`);
    }

}
