import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("encuesta")
export class Poll extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column("varchar", {
        name: "fecha_creacion",
    })
    public fechaCreacion: string;

    @Column("varchar", {
        name: "fecha_desde",
    })
    public fechaDesde: string;

    @Column("varchar", {
        name: "fecha_hasta",
    })
    public fechaHasta: string;

    @Column("varchar", {
        name: "creado_por",
    })
    public creadoPro: string;

    @Column("integer")
    public estado: number;

    @Column("varchar", {
        name: "nombre_encuesta",
    })
    public nombreEncuesta: string;

    @Column("varchar", {
        name: "detalle_encuenta",
    })
    public detalleEncuesta: string;

}
