import { getConnection } from "typeorm";
import { Hashtag, PostHashtag } from "../entity";
import { PostHashtagRepository } from "../repository";

export class HashtagService {

    private postHashtag: PostHashtag;
    private hashtag: Hashtag;

    constructor() {
        this.hashtag = new Hashtag();
        this.postHashtag = new PostHashtag();
    }

    public async associatePostHashtag(client: string, postId: number, content: string, reset: boolean = true): Promise<void> {
        const newhashtags: string[] = content.match(/([#][áéíóúña-zÑÁÉÍÓÚA-Z\d-+(\.]+)/g);
        if (reset) {
            await getConnection(client).getCustomRepository(PostHashtagRepository).removeAssociationByPost(postId);
        }
        if (newhashtags) {
            for (const newhashtag of newhashtags) {
                const hashtag = await Hashtag.findByText(newhashtag);
                if (hashtag) {
                    await this.createAssociation(client, postId, hashtag.id);
                } else {
                    this.hashtag.text = newhashtag;
                    const createdHashtag = await getConnection(client).getRepository(Hashtag).save(this.hashtag);
                    await this.createAssociation(client, postId, createdHashtag.id);
                }
            }
        }
    }

    private async createAssociation(client: string, postId: number, hashtagId: number): Promise<void> {
        await getConnection(client).getCustomRepository(PostHashtagRepository).removeAssociationByPostHashtag(postId, hashtagId);
        this.postHashtag.postId = postId;
        this.postHashtag.hashtagId = hashtagId;
        await getConnection(client).getRepository(PostHashtag).save(this.postHashtag);
    }

}
