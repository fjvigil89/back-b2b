import { PRINCIPAL } from "../../config/database";

export async function getEndpoint(userId: string): Promise<string | null> {
    return PRINCIPAL.then((conn) => conn.query(`SELECT b.endpoint from TBL_USER_B2B a
    inner JOIN TBL_CLIENT_B2B b
    ON a.client_id = b.id
    WHERE a.id = "${userId}"`))
        .then((result) => {
            return result.length ? result[0].endpoint : null;
        });
}
