import * as moment from "moment";
import { getConnection } from "typeorm";
import { Case } from "../entity";
import { CasesRepository, ItemRepository } from "../repository";

export class CasesService {

    public async create(client: string, userId: string, newCase: ICaseRequest): Promise<number> {
        try {
            console.log("client: ", client);
            console.log("userId: ", userId);
            console.log("newCase: ", newCase);
            const { ean, folio, ventaPerdida } = newCase;
            const item = await getConnection(client)
                            .getCustomRepository(ItemRepository)
                            .findItem(ean, folio, ventaPerdida);
            console.log("item: ", JSON.stringify(item));
            console.log("Create: ", {
                ...newCase,
                itemId: item.id,
                dateAction: moment().format("YYYY-MM-DD"),
                userId,
            });
            const createdCase = await getConnection(client).getRepository(Case).create({
                ...newCase,
                itemId: item.id,
                dateAction: moment().format("YYYY-MM-DD"),
                userId,
            });
            const { dateAction } = createdCase;
            const existCase = await getConnection(client)
                                .getCustomRepository(CasesRepository)
                                .findCase(folio, ean, dateAction);

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
