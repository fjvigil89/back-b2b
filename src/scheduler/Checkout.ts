import { CronJob } from "cron";
import { getConnection } from "typeorm";
import { CheckRepository } from "../repository";

export const CheckSchedulerANDINA = new CronJob(
  "10 00 * * *",
  async () => {
    await getConnection("andina")
      .getCustomRepository(CheckRepository)
      .closeChecks();
  },
  null,
  null,
  "America/Santiago",
);

export const CheckSchedulerPERNOD = new CronJob(
  "32 00 * * *",
  async () => {
    await getConnection("pernod")
      .getCustomRepository(CheckRepository)
      .closeChecks();
  },
  null,
  null,
  "America/Santiago",
);

export const CheckSchedulerICB = new CronJob(
  "42 00 * * *",
  async () => {
    await getConnection("icb")
      .getCustomRepository(CheckRepository)
      .closeChecks();
  },
  null,
  null,
  "America/Santiago",
);

export const CheckSchedulerCIAL = new CronJob(
  "52 00 * * *",
  async () => {
    await getConnection("cial")
      .getCustomRepository(CheckRepository)
      .closeChecks();
  },
  null,
  null,
  "America/Santiago",
);
