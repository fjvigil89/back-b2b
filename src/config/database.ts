import { ConnectionManager, createConnections } from "typeorm";
import {
    Case,
    CaseFeedback,
    Check,
    Comment,
    Hashtag,
    Image,
    Item,
    LikeComment,
    LikePost,
    LikeReply,
    Poll,
    Post,
    PostHashtag,
    Question,
    Reply,
    Store,
    Summary,
    User,
} from "../entity";
import { config, DIALECT } from "./config";

export const Connection = createConnections([{
    name: "pernod",
    database: config.PERNOD_DB.DB,
    entities: [Case,
        CaseFeedback,
        Check,
        Comment,
        Hashtag,
        Image,
        Item,
        LikeComment,
        LikePost,
        LikeReply,
        Poll,
        Post,
        PostHashtag,
        Question,
        Reply,
        Store,
        Summary,
        User,
    ],
    host: config.PERNOD_DB.SERVER,
    logging: false,
    password: config.PERNOD_DB.PASSWORD,
    port: config.PERNOD_DB.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.PERNOD_DB.USER_DB,
}, {
    name: "icb",
    database: config.ICB_DB.DB,
    entities: [
        Case,
        CaseFeedback,
        Check,
        Comment,
        Hashtag,
        Image,
        Item,
        LikeComment,
        LikePost,
        LikeReply,
        Poll,
        Post,
        PostHashtag,
        Question,
        Reply,
        Store,
        Summary,
        User,
    ],
    host: config.ICB_DB.SERVER,
    logging: false,
    password: config.ICB_DB.PASSWORD,
    port: config.ICB_DB.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.ICB_DB.USER_DB,
}, {
    name: "andina",
    database: config.ANDINA_DB.DB,
    entities: [
        Case,
        CaseFeedback,
        Check,
        Comment,
        Hashtag,
        Image,
        Item,
        LikeComment,
        LikePost,
        LikeReply,
        Poll,
        Post,
        PostHashtag,
        Question,
        Reply,
        Store,
        Summary,
        User,
    ],
    host: config.ANDINA_DB.SERVER,
    logging: false,
    password: config.ANDINA_DB.PASSWORD,
    port: config.ANDINA_DB.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.ANDINA_DB.USER_DB,
}, {
    name: "abi",
    database: config.ABI_DB.DB,
    entities: [
        Case,
        CaseFeedback,
        Check,
        Comment,
        Hashtag,
        Image,
        Item,
        LikeComment,
        LikePost,
        LikeReply,
        Poll,
        Post,
        PostHashtag,
        Question,
        Reply,
        Store,
        Summary,
        User,
    ],
    host: config.ABI_DB.SERVER,
    logging: false,
    password: config.ABI_DB.PASSWORD,
    port: config.ABI_DB.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.ABI_DB.USER_DB,
}]);

export const B2B = {
    icb: new ConnectionManager().create({
        database: config.ICB_B2B.DB,
        entities: [],
        host: config.ICB_B2B.SERVER,
        logging: false,
        password: config.ICB_B2B.PASSWORD,
        port: config.ICB_B2B.PORT_DB,
        synchronize: false,
        type: DIALECT,
        username: config.ICB_B2B.USER_DB,
    }).connect(),
    pernod: new ConnectionManager().create({
        database: config.PERNOD_B2B.DB,
        entities: [],
        host: config.PERNOD_B2B.SERVER,
        logging: false,
        password: config.PERNOD_B2B.PASSWORD,
        port: config.PERNOD_B2B.PORT_DB,
        synchronize: false,
        type: DIALECT,
        username: config.PERNOD_B2B.USER_DB,
    }).connect(),
    andina: new ConnectionManager().create({
        database: config.ANDINA_B2B.DB,
        entities: [],
        host: config.ANDINA_B2B.SERVER,
        logging: false,
        password: config.ANDINA_B2B.PASSWORD,
        port: config.ANDINA_B2B.PORT_DB,
        synchronize: false,
        type: DIALECT,
        username: config.ANDINA_B2B.USER_DB,
    }).connect(),
};

export const SUPI = new ConnectionManager().create({
    database: config.SOURCE_SUPI.DB,
    entities: [],
    host: config.SOURCE_SUPI.SERVER,
    logging: false,
    password: config.SOURCE_SUPI.PASSWORD,
    port: config.SOURCE_SUPI.PORT_DB,
    synchronize: false,
    type: "mssql",
    connectionTimeout: 120000,
    requestTimeout: 120000,
    username: config.SOURCE_SUPI.USER_DB,
}).connect();

export const MASTER = new ConnectionManager().create({
    database: config.SOURCE_MASTER.DB,
    entities: [],
    host: config.SOURCE_MASTER.SERVER,
    logging: false,
    password: config.SOURCE_MASTER.PASSWORD,
    port: config.SOURCE_MASTER.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.SOURCE_MASTER.USER_DB,
}).connect();

export const PRINCIPAL = new ConnectionManager().create({
    database: config.SOURCE_PRINCIPAL.DB,
    entities: [],
    host: config.SOURCE_PRINCIPAL.SERVER,
    logging: false,
    password: config.SOURCE_PRINCIPAL.PASSWORD,
    port: config.SOURCE_PRINCIPAL.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.SOURCE_PRINCIPAL.USER_DB,
}).connect();
