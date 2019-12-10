import * as moment from "moment";
import { getConnection } from "typeorm";
import { Case } from "../entity";
import { CasesRepository, ItemRepository } from "../repository";

export class CasesService {

    public async create(client: string, userId: string, newCase: ICaseRequest): Promise<number> {
        try {
            const { ean, folio, ventaPerdida } = newCase;
            const dateAction = moment().format("YYYY-MM-DD");
            const item = await getConnection(client)
                            .getCustomRepository(ItemRepository)
                            .findItem(ean, folio, ventaPerdida);
            if (!item) {
                throw new Error("El item del cual se creo la gestion no existe");
            }

            const createCase = await getConnection(client)
                .getRepository(Case)
                .create({
                    ...newCase,
                    itemId: item.id,
                    dateAction,
                    userId,
                });
            const existCase = await getConnection(client)
                                .getCustomRepository(CasesRepository)
                                .findCase(folio, ean, dateAction);
            if (!existCase) {
                const resultCreate = await getConnection(client)
                    .getRepository(Case)
                    .save(createCase);
                return resultCreate.id;
            }
        } catch (err) {
            console.error(err);
            return err;
        }
    }

}
