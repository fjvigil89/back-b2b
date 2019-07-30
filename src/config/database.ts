import { ConnectionManager, createConnection } from "typeorm";
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

export const Connection = createConnection({
    database: config.DATABASE.DB,
    entities: [
        Poll,
        Summary,
        Check,
        Comment,
        CaseFeedback,
        Hashtag,
        Case,
        Item,
        Image,
        LikeComment,
        LikePost,
        LikeReply,
        Post,
        PostHashtag,
        Store,
        Reply,
        User,
        Question,
    ],
    host: config.DATABASE.SERVER,
    logging: false,
    password: config.DATABASE.PASSWORD,
    port: config.DATABASE.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.DATABASE.USER_DB,
});

export const B2B = new ConnectionManager().create({
    database: config.SOURCE_B2B.DB,
    entities: [],
    host: config.SOURCE_B2B.SERVER,
    logging: false,
    password: config.SOURCE_B2B.PASSWORD,
    port: config.SOURCE_B2B.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.SOURCE_B2B.USER_DB,
}).connect();

export const SUPI = new ConnectionManager().create({
    database: config.SOURCE_SUPI.DB,
    entities: [],
    host: config.SOURCE_SUPI.SERVER,
    logging: false,
    password: config.SOURCE_SUPI.PASSWORD,
    port: config.SOURCE_SUPI.PORT_DB,
    synchronize: false,
    type: "mssql",
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
