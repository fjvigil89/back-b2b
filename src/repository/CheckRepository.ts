import * as moment from "moment";
import { EntityRepository, Repository } from "typeorm";
import { Check } from "../entity";

@EntityRepository(Check)
export class CheckRepository extends Repository<Check> {

    public findLastCheck(userId: string): Promise<Check | null> {
        return this.findOne({
            order: {
                dateCheckIn: "DESC",
            },
            where: {
                userId,
            },
        });
    }

    public async closeChecks(): Promise<void> {
        await this.update({
            dateCheckOut: null,
        }, {
                dateCheckOut: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            });
    }

}
