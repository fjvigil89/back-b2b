import { EntityRepository, Repository } from "typeorm";
import { Poll } from "../entity";

@EntityRepository(Poll)
export class PollRepository extends Repository<Poll> {

    public listPoll(folio?: number): Promise<IListPoll[]> {
        return this.query(`SELECT
        a.id,
        a.nombre_encuesta,
        a.detalle_encuenta,
        b.id_sala_encuesta,
        c.bandera,
        c.cadena,
        c.cod_local,
        c.date_b2b,
        c.descripcion,
        c.direccion,
        c.fecha_visita,
        c.folio,
        c.latitud,
        c.longitud,
        c.mide,
        c.osa,
        c.realizada,
        c.venta_perdida,
        IF(MAX(d.respuesta) IS NULL, "available", "complete") as state
        FROM encuesta a
        INNER JOIN sala_encuesta b ON
        a.id = b.id_encuesta
        INNER JOIN store c ON
        b.folio = c.folio
        INNER JOIN plano_encuesta d ON
        d.id_sala_encuesta = b.id_sala_encuesta
        WHERE a.estado = 1 AND b.estado = 1
        ${folio ? `AND c.folio = ${folio}` : ``}
        GROUP BY b.id_sala_encuesta`);
    }

    public findBySalaPoll(idSalaEncuesta: number): Promise<IDetailPoll[]> {
        return this.query(`SELECT c.id, d.descripcion as item, e.descripcion as response, e.tipo from encuesta a
        INNER JOIN sala_encuesta b ON
        a.id = b.id_encuesta
        INNER JOIN plano_encuesta c ON
        b.id_sala_encuesta = c.id_sala_encuesta
        INNER JOIN item_encuesta d ON
        c.id_item = d.id
        INNER JOIN tipo_dato e ON
        c.id_tipo = e.id
        WHERE b.id_sala_encuesta = ${idSalaEncuesta}`);
    }

    public async answerPoll(id: number, response: string): Promise<void> {
        await Promise.all([
            this.query(`UPDATE plano_encuesta SET respuesta = "${response}" WHERE id = ${id}`),
            this.query(`UPDATE sala_encuesta a
            INNER JOIN plano_encuesta b
            ON a.id_sala_encuesta = b.id_sala_encuesta
            SET a.estado = 0
            WHERE b.id = ${id}`),
        ]);
    }

}
