import * as moment from "moment";
import { SUPI } from "../../config/database";

export async function visitaCadem(folio: number): Promise<IdataCadem> {
    const visitas = await ultimasVisitas(folio);
    const cademResult = { id_visita: null, mide: 0, realizada: 0, fecha_visita: null, pendiente: 0 };
    for (const visita of visitas) {
        if (visita.estado === 4) {
            if (!cademResult.id_visita) {
                cademResult.id_visita = visita.id_visita;
                cademResult.fecha_visita = visita.fecha;
            }
            cademResult.mide = 1;
            cademResult.realizada = 1;
        } else if (visita.estado === 1) {
            cademResult.pendiente = 1;
        }
    }
    return cademResult;
}

function ultimasVisitas(folio: number): Promise<Array<{ id_visita: number, fecha: string, estado: number }>> {
    return SUPI.then((conn) => conn.query(`
        SELECT TOP 2 a.ID_VISITA as id_visita
            , a.HORAINICIO as fecha
            , a.ESTADO as estado
        FROM VISITA a WITH(NOLOCK)
        INNER JOIN ESTUDIOSALA b WITH(NOLOCK)
            ON a.ID_ESTUDIOSALA = b.ID_ESTUDIOSALA
        INNER JOIN SALA c WITH(NOLOCK)
            ON b.ID_SALA = c.ID_SALA
        INNER JOIN ESTUDIO d WITH(NOLOCK)
            ON d.ID_ESTUDIO = b.ID_ESTUDIO
        WHERE c.FOLIOCADEM = ${folio}
            AND d.ID_ESTUDIO = 34
            AND a.DIA >= '${moment().subtract(30, "day").format("YYYY-MM-DD")}'
        ORDER BY a.DIA DESC`));
}

export function tomaVisita(visitaId: number): Promise<IToma[]> {
    return SUPI.then((conn) => conn.query(`
        SELECT CONVERT(int, A.VALOR) as valor
            , b.DESCRIPCION as descripcion
            , b.EAN as ean
            , c.DESCRIPCION as categoria
        FROM TOMA a WITH(NOLOCK)
        INNER JOIN dbo.ITEM b WITH(NOLOCK)
            ON a.ID_PRODUCTO = b.ID_ITEM
        INNER JOIN CODIGOS c WITH(NOLOCK)
            ON b.ID_CATEGORIA = c.ID_CODIGO
        WHERE a.ID_VISITA = ${visitaId}
            AND a.ID_VARIABLE = 1
    `));
}

export function OSA(toma: IToma[]) {
    return toma.reduce((acc, current) => Number(current.valor) ? acc + 1 : acc, 0) / toma.length * 100;
}
