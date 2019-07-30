import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("image")
export class Image extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar")
    public path: string;

    @Column("integer", {
        name: "post_id",
    })
    public postId: string;

}
