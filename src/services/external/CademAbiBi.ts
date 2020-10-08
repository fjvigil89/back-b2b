import { NumberAttributeValue } from "aws-sdk/clients/clouddirectory";
import { CADEM_ABI_BI } from "./../../config/database";

export const getDataFunc = async (idVisita: number): Promise<any> =>
  CADEM_ABI_BI.then((conn) =>
    conn.query(`
    SELECT t.ean, i.i_categoria, i.i_item descripcion, t.id_variable
      FROM TBL_TOMA_OSA t
      LEFT JOIN item_master i ON i.i_ean = t.ean
      WHERE id_visita_supi=${idVisita}
  `),
  );
/* **** OSA ***** */
export const getOsaBreaksDetail = async (idVisita: number): Promise<any> =>
  CADEM_ABI_BI.then((conn) =>
    conn.query(`
    SELECT t.ean, i.i_categoria categoria, i.i_item descripcion
    FROM TBL_TOMA_OSA t
    LEFT JOIN item_master i ON i.i_ean = t.EAN
    WHERE t.ID_VARIABLE = 1 AND t.RESPUESTA = '0' and ID_VISITA_SUPI = ${idVisita} AND t.EAN NOT LIKE '%9999PROM%'`),
  );

export const getOsaResume = async (idVisita: number): Promise<any> =>
  CADEM_ABI_BI.then((conn) =>
    conn
      .query(
        `
    SELECT COUNT(1) productosTotal, (COUNT(1) - SUM(t.RESPUESTA)) productosNoEncontrados, left(v.FECHA, 10) fechaAuditoria
    FROM TBL_TOMA_OSA t
    INNER JOIN TBL_VISITAS v ON v.ID_VISITA_SUPI = t.ID_VISITA_SUPI
    WHERE t.ID_VARIABLE = 1 and t.ID_VISITA_SUPI = ${idVisita} AND t.EAN NOT LIKE '%9999PROM%'
    `,
      )
      .then((res) => (res.length ? res[0] : null)),
  );

/* **** PROMOCIONES ***** */

export const getBreaksDetail = async (idVisita: number): Promise<any> =>
  CADEM_ABI_BI.then((conn) =>
    conn.query(`SELECT t.ean, i.i_categoria categoria, i.i_item descripcion
  FROM TBL_TOMA_OSA t
  LEFT JOIN item_master i ON i.i_ean = t.EAN
  WHERE t.ID_VARIABLE = 1 AND t.RESPUESTA = '0' and ID_VISITA_SUPI = ${idVisita} AND t.EAN LIKE '%9999PROM%'`),
  );

export const getResume = async (idVisita: number): Promise<any> =>
  CADEM_ABI_BI.then((conn) =>
    conn
      .query(
        `SELECT COUNT(1) productosTotal, (COUNT(1) - SUM(t.RESPUESTA)) productosNoEncontrados, left(v.FECHA, 10) fechaAuditoria
  FROM TBL_TOMA_OSA t
  INNER JOIN TBL_VISITAS v ON v.ID_VISITA_SUPI = t.ID_VISITA_SUPI
  WHERE t.ID_VARIABLE = 1 and t.ID_VISITA_SUPI = ${idVisita} AND t.EAN LIKE '%9999PROM%'`,
      )
      .then((res) => (res.length ? res[0] : null)),
  );
