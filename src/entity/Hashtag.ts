import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("hashtag")
export class Hashtag extends BaseEntity {

    public static findByText(text: string): Promise<Hashtag> {
        return this.findOne({
            where: {
                text,
            },
        });
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public text: string;

}
