import * as moment from "moment";
import { getConnection } from "typeorm";
import { Case } from "../entity";
import { CasesRepository, ItemRepository } from "../repository";

export class CasesService {

    public async create(client: string, userId: string, newCase: ICaseRequest): Promise<number> {
        try {
            const createdCase = getConnection(client).getRepository(Case).create({
                ...newCase,
                dateAction: moment().format("YYYY-MM-DD"),
                userId,
            });
            const { ean, folio, ventaPerdida, dateAction } = createdCase;
            const [item, existCase] = await Promise.all([
                getConnection(client).getCustomRepository(ItemRepository).findItem(ean, folio, ventaPerdida),
                getConnection(client).getCustomRepository(CasesRepository).findCase(folio, ean, dateAction),
            ]);

            if (!item) {
                throw new Error("El item del cual se creo la gestion no existe");
            } else if (!existCase) {
                const resultCreate = await getConnection(client).getRepository(Case).save(newCase);
                return resultCreate.id;
            }
        } catch (err) {
            console.error(err);
            return err;
        }
    }

}
