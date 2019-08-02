import { env } from "process";

export const DIALECT = "mariadb";

const LOCAL_CONFIGURATION = {
    DB: "b2b-app",
    PASSWORD: "Cadem2018Dev",
    PORT_DB: 3306,
    SERVER: "localhost",
    USER_DB: "cademsmart",
};

const PRODUCTION_CONFIGURATION = {
    DB: env.PRODUCTION_CONFIGURATION_DB,
    PASSWORD: env.PRODUCTION_CONFIGURATION_PASSWORD,
    PORT_DB: Number(env.PRODUCTION_CONFIGURATION_PORT_DB),
    SERVER: env.PRODUCTION_CONFIGURATION_SERVER,
    USER_DB: env.PRODUCTION_CONFIGURATION_USER_DB,
};

export const config = {
    DATABASE: PRODUCTION_CONFIGURATION,
    PORT_APP: 1344,
    SECRET: "HltH3R3",
    SOURCE_B2B: {
        ...PRODUCTION_CONFIGURATION,
        DB: env.SOURCE_B2B_DB,
    },
    SOURCE_MASTER : {
        DB: env.SOURCE_MASTER_DB,
        PASSWORD: env.SOURCE_MASTER_PASSWORD,
        PORT_DB: Number(env.SOURCE_MASTER_PORT_DB),
        SERVER: env.SOURCE_MASTER_SERVER,
        USER_DB: env.SOURCE_MASTER_USER_DB,
    },
    SOURCE_PRINCIPAL : {
        DB: env.SOURCE_PRINCIPAL_DB,
        PASSWORD: env.SOURCE_PRINCIPAL_PASSWORD,
        PORT_DB: Number(env.SOURCE_PRINCIPAL_PORT_DB),
        SERVER: env.SOURCE_PRINCIPAL_SERVER,
        USER_DB: env.SOURCE_PRINCIPAL_USER_DB,
    },
    SOURCE_SUPI : {
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
