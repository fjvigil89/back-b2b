import { getConnection } from "typeorm";
import { Case } from "../entity";
import { CasesRepository, ItemRepository } from "../repository";

export class CasesService {

    public async create(client: string, newCase: Case): Promise<number> {
        try {
            const { ean, folio, ventaPerdida, dateAction } = newCase;
            const [item, existCase] = await Promise.all([
                getConnection(client).getCustomRepository(ItemRepository).findItem(ean, folio, ventaPerdida),
                getConnection(client).getCustomRepository(CasesRepository).findCase(folio, ean, dateAction),
            ]);

            if (!item) {
                throw new Error();
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
