import { env } from "process";

export const DIALECT = "mariadb";

const LOCAL_CONFIGURATION = {
    DB: "b2b-app",
    PASSWORD: "Cadem2018Dev",
    PORT_DB: 3306,
    SERVER: "localhost",
    USER_DB: "cademsmart",
};

const ICB_PRODUCTION = {
    DB: "b2b-app",
    PASSWORD: env.B2B_ICB_PASSWORD,
    PORT_DB: Number(env.B2B_ICB_PORT),
    SERVER: env.B2B_ICB_SERVER,
    USER_DB: env.B2B_ICB_USERNAME,
};

const PERNOD_PRODUCTION = {
    DB: "b2b-app",
    PASSWORD: env.B2B_PERNOD_PASSWORD,
    PORT_DB: Number(env.B2B_PERNOD_PORT),
    SERVER: env.B2B_PERNOD_SERVER,
    USER_DB: env.B2B_PERNOD_USERNAME,
};

export const config = {
    PERNOD_DB: PERNOD_PRODUCTION,
    ICB_DB: ICB_PRODUCTION,
    PORT_APP: 1344,
    SECRET: "HltH3R3",
    PERNOD_B2B: {
        ...PERNOD_PRODUCTION,
        DB: "b2b-pernod",
    },
    ICB_B2B: {
        ...ICB_PRODUCTION,
        DB: "b2b-icb",
    },
    SOURCE_MASTER: {
        DB: env.SOURCE_MASTER_DB,
        PASSWORD: env.SOURCE_MASTER_PASSWORD,
        PORT_DB: Number(env.SOURCE_MASTER_PORT_DB),
        SERVER: env.SOURCE_MASTER_SERVER,
        USER_DB: env.SOURCE_MASTER_USER_DB,
    },
    SOURCE_PRINCIPAL: {
        DB: env.SOURCE_PRINCIPAL_DB,
        PASSWORD: env.SOURCE_PRINCIPAL_PASSWORD,
        PORT_DB: Number(env.SOURCE_PRINCIPAL_PORT_DB),
        SERVER: env.SOURCE_PRINCIPAL_SERVER,
        USER_DB: env.SOURCE_PRINCIPAL_USER_DB,
    },
    SOURCE_SUPI: {
        DB: env.SOURCE_SUPI_DB,
        PASSWORD: env.SOURCE_SUPI_PASSWORD,
        PORT_DB: Number(env.SOURCE_SUPI_PORT_DB),
        SERVER: env.SOURCE_SUPI_SERVER,
        USER_DB: env.SOURCE_SUPI_USER_DB,
    },
    KM: env.KM,
};

export const AWS_CREDENTIALS = {
    accessKeyId: env.AWS_CREDENTIALS_accessKeyId,
    secretAccessKey: env.AWS_CREDENTIALS_secretAccessKey,
};
