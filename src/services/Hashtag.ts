import { getCustomRepository } from "typeorm";
import { Hashtag, PostHashtag } from "../entity";
import { PostHashtagRepository } from "../repository";

export class HashtagService {

    private postHashtag: PostHashtag;
    private hashtag: Hashtag;

    constructor() {
        this.hashtag = new Hashtag();
        this.postHashtag = new PostHashtag();
    }

    public async associatePostHashtag(postId: number, content: string, reset: boolean = true): Promise<void> {
        const newhashtags: string[] = content.match(/([#][áéíóúña-zÑÁÉÍÓÚA-Z\d-+(\.]+)/g);
        if (reset) {
            await getCustomRepository(PostHashtagRepository).removeAssociationByPost(postId);
        }
        if (newhashtags) {
            for (const newhashtag of newhashtags) {
                const hashtag = await Hashtag.findByText(newhashtag);
                if (hashtag) {
                    await this.createAssociation(postId, hashtag.id);
                } else {
                    this.hashtag.text = newhashtag;
                    const createdHashtag = await this.hashtag.save();
                    await this.createAssociation(postId, createdHashtag.id);
                }
            }
        }
    }

    private async createAssociation(postId: number, hashtagId: number): Promise<void> {
        await getCustomRepository(PostHashtagRepository).removeAssociationByPostHashtag(postId, hashtagId);
        this.postHashtag.postId = postId;
        this.postHashtag.hashtagId = hashtagId;
        await this.postHashtag.save();
    }

}
