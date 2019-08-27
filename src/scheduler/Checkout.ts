import { CronJob } from "cron";
import { getCustomRepository } from "typeorm";
import { CheckRepository } from "../repository";

export const CheckSchedulerPERNOD = new CronJob("32 00 * * *", async () => {
    await getCustomRepository(CheckRepository).closeChecks();
}, null, null, "America/Santiago");

export const CheckSchedulerICB = new CronJob("42 00 * * *", async () => {
    await getCustomRepository(CheckRepository).closeChecks();
}, null, null, "America/Santiago");
