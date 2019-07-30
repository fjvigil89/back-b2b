import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("case_feedback")
export class CaseFeedback extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("integer", { name: "case_id" })
    public caseId: number;

    @Column("integer", { name: "question_id" })
    public questionId: number;

    @Column("varchar", { name: "answer" })
    public answer: string;

    @Column("varchar")
    public ean: string;

    @Column("integer", { name: "folio" })
    public folio: number;

    @Column("varchar", { name: "date" })
    public date: string;

}
