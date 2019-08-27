import { getConnection } from "typeorm";
import { Case } from "../entity";
import { CasesRepository, ItemRepository } from "../repository";

export class CasesService {

    public async create(client: string, newCase: Case): Promise<number> {
        try {
            const [item, existCase] = await Promise.all([
                getConnection(client).getCustomRepository(ItemRepository).findItem(newCase.ean, newCase.folio, newCase.ventaPerdida),
                getConnection(client).getCustomRepository(CasesRepository).findCase(newCase.folio, newCase.ean, newCase.dateAction),
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
