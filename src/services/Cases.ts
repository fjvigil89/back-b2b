import { getCustomRepository } from "typeorm";
import { Case } from "../entity";
import { CasesRepository, ItemRepository } from "../repository";

export class CasesService {

    public async create(newCase: Case): Promise<number> {
        try {
            const [ item, existCase ] = await Promise.all([
                getCustomRepository(ItemRepository).findItem(newCase.ean, newCase.folio, newCase.ventaPerdida),
                getCustomRepository(CasesRepository).findCase(newCase.folio, newCase.ean, newCase.dateAction),
            ]);

            if (!item) {
                throw new Error();
            } else if (!existCase) {
                const resultCreate = await newCase.save();
                return resultCreate.id;
            }
        } catch (err) {
            console.error(err);
            return err;
        }
    }

}
