import * as moment from "moment";
import { getConnection } from "typeorm";
import { Check } from "../entity";
import { CheckRepository, StoreRepository } from "../repository";

export class CheckService {

    private check: Check;

    constructor() {
        this.check = new Check();
    }

    public async createCheck(client: string, folio: number, userId: string, type: string): Promise<void> {
        const store = await getConnection(client).getCustomRepository(StoreRepository).findByStoreId(folio);
        if (store) {
            const prevCheck = await getConnection(client).getCustomRepository(CheckRepository).findLastCheck(userId);
            if (prevCheck) {
                if (type === "in") {
                    if (prevCheck.dateCheckOut) {
                        await this.newCheck(client, userId, folio);
                    } else {
                        throw new Error("Ya existe una visita en progreso");
                    }
                } else if (type === "out") {
                    if (prevCheck.dateCheckIn && prevCheck.dateCheckOut == null) {
                        prevCheck.dateCheckOut = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                        await getConnection(client).getRepository(Check).save(prevCheck);
                    } else {
                        throw new Error("No existe ninguna visita en progreso");
                    }
                }
            } else {
                if (type === "in") {
                    await this.newCheck(client, userId, folio);
                } else {
                    throw new Error("No existe ninguna visita en progreso");
                }
            }
        } else {
            throw new Error(`No existe el folio`);
        }
    }

    private async newCheck(client: string, userId: string, folio: number): Promise<void> {
        this.check.userId = userId;
        this.check.folio = folio;
        this.check.dateCheckIn = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        await getConnection(client).getRepository(Check).save(this.check);
    }

}
