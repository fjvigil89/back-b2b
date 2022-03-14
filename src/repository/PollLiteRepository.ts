import { EntityRepository, Repository } from "typeorm";
import { Poll } from "../entity";

@EntityRepository(Poll)
export class PollLiteRepository extends Repository<Poll> {
    public listPoll(folio?: number, userId?: string): Promise<IListPoll[]> {
        return this.query(`
        SELECT
            a.id
            , a.nombre_encuesta
            , a.detalle_encuenta
            , b.id_sala_encuesta
            , c.bandera
            , c.cadena
            , c.cod_local
            , c.date_b2b
            , c.descripcion
            , c.direccion
            , c.fecha_visita
            , c.folio
            , c.latitud
            , c.longitud
            , c.mide
            , c.osa
            , c.realizada
            , c.venta_perdida
            , IF(
                MAX(d.respuesta) IS NULL
                , "available"
                , "complete"
            ) AS state
        FROM encuesta a
        INNER JOIN sala_encuesta b ON
            a.id = b.id_encuesta
        INNER JOIN store c ON
            b.folio = c.folio
        INNER JOIN user_store u ON
            b.folio = u.folio
        INNER JOIN plano_encuesta d ON
            d.id_sala_encuesta = b.id_sala_encuesta
        WHERE a.estado = 1
        ${folio ? `AND c.folio = ${folio}` : ``}
        ${userId ? `AND u.user_id =  '${userId}'` : ``}
        GROUP BY b.id_sala_encuesta`);
    }

    public findBySalaPoll(idSalaEncuesta: number): Promise<IDetailPoll[]> {
        return this.query(`
        SELECT
            c.id
            , d.descripcion AS item
            , e.descripcion AS response
            , e.tipo
        FROM encuesta a
        INNER JOIN sala_encuesta b ON
            a.id = b.id_encuesta
        INNER JOIN plano_encuesta c ON
            b.id_sala_encuesta = c.id_sala_encuesta
        INNER JOIN item_encuesta d ON
            c.id_item = d.id
        INNER JOIN tipo_dato e ON
            c.id_tipo = e.id
        WHERE b.id_sala_encuesta = ${idSalaEncuesta}
        ORDER BY c.id ASC`);
    }

    public async answerPoll(id: number, response: string, date: string, user: string): Promise<void> {
        await Promise.all([
            this.query(`
                UPDATE plano_encuesta
                SET respuesta = "${response}" 
                WHERE id = ${id}
            `),
            this.query(`
                UPDATE sala_encuesta a
                SET 
                    a.estado = 0
                    , a.fecha_real = "${date}"
                    , a.usuario = "${user}" 
                WHERE
                    a.id_sala_encuesta = (SELECT id_sala_encuesta FROM plano_encuesta WHERE id = ${id})
            `),
        ]);
    }

    public listPollUser(user: string): Promise<string[]> {
        return this.query(`SELECT b.folio FROM user a
        INNER JOIN user_store b
        ON a.id = b.user_id
        WHERE a.id = "${user}"`)
            .then((stores) => {
                return stores.map((store) => store.folio);
            });
    }

    public dataPoll(folios: string[], userId: string): Promise<any[]> {
        return this.query(`SELECT a.*,
        IF(b.id_sala_encuesta is NOT NULL, 1, 0) as hasPoll,
        IF(lastCheck.id IS NOT NULL AND lastCheck.date_check_out IS NULL, 1, 0) as visita_en_progreso FROM store a
        LEFT JOIN (
            SELECT folio, id_sala_encuesta from encuesta a
            INNER JOIN sala_encuesta b
            ON a.id = b.id_encuesta
            WHERE a.estado = 1 AND b.estado = 1
            GROUP BY folio
        ) b ON
            a.folio = b.folio
        LEFT JOIN (
            SELECT * from ${"`check`"} WHERE user_id = "${userId}" ORDER by date_check_in DESC LIMIT 1
        ) as lastCheck ON
        a.folio = lastCheck.folio
        WHERE a.folio IN (${folios}) AND a.cadena is NOT NULL
        ORDER BY a.venta_perdida DESC`);
    }
}