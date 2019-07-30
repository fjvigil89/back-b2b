import { CronJob } from "cron";
import { getCustomRepository } from "typeorm";
import { CheckRepository } from "../repository";

export const CheckScheduler = new CronJob("32 00 * * *", async () => {
    await getCustomRepository(CheckRepository).closeChecks();
}, null, null, "America/Santiago");
