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

export const Connection = createConnections([
  {
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
    connectTimeout: 120000,
    type: DIALECT,
    username: config.ANDINA_DB.USER_DB,
  },
  {
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
    connectTimeout: 120000,
    type: DIALECT,
    username: config.ABI_DB.USER_DB,
  },
  {
    name: "demo",
    database: config.DEMO_DB.DB,
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
    host: config.DEMO_DB.SERVER,
    logging: false,
    password: config.DEMO_DB.PASSWORD,
    port: config.DEMO_DB.PORT_DB,
    synchronize: false,
    type: DIALECT,
    username: config.DEMO_DB.USER_DB,
  },
]);

export const B2B = {
  andina_app: new ConnectionManager()
    .create({
      database: config.ANDINA_DB.BD,
      entities: [],
      host: config.ANDINA_DB.SERVER,
      logging: false,
      password: config.ANDINA_DB.PASSWORD,
      port: config.ANDINA_DB.PORT_DB,
      synchronize: false,
      type: DIALECT,
      connectTimeout: 120000,
      username: config.ANDINA_DB.USER_DB,
    })
    .connect(),
  abi_app: new ConnectionManager()
    .create({
      database: config.ABI_DB.DB,
      entities: [],
      host: config.ABI_DB.SERVER,
      logging: false,
      password: config.ABI_DB.PASSWORD,
      port: config.ABI_DB.PORT_DB,
      synchronize: false,
      type: DIALECT,
      connectTimeout: 120000,
      username: config.ABI_DB.USER_DB,
    })
    .connect(),
  andina: new ConnectionManager()
    .create({
      database: config.ANDINA_B2B.DB,
      entities: [],
      host: config.ANDINA_B2B.SERVER,
      logging: false,
      password: config.ANDINA_B2B.PASSWORD,
      port: config.ANDINA_B2B.PORT_DB,
      synchronize: false,
      type: DIALECT,
      connectTimeout: 120000,
      username: config.ANDINA_B2B.USER_DB,
    })
    .connect(),
  abi: new ConnectionManager()
    .create({
      database: config.ABI_B2B.DB,
      entities: [],
      host: config.ABI_B2B.SERVER,
      logging: false,
      password: config.ABI_B2B.PASSWORD,
      port: config.ABI_B2B.PORT_DB,
      synchronize: false,
      connectTimeout: 120000,
      // requesTimeout: 120000,
      type: DIALECT,
      username: config.ABI_B2B.USER_DB,
    })
    .connect(),
  demo: new ConnectionManager()
    .create({
      database: config.DEMO_B2B.DB,
      entities: [],
      host: config.DEMO_B2B.SERVER,
      logging: false,
      password: config.DEMO_B2B.PASSWORD,
      port: config.DEMO_B2B.PORT_DB,
      synchronize: false,
      type: DIALECT,
      username: config.DEMO_B2B.USER_DB,
    })
    .connect(),
};

export const CADEM_ABI_BI = new ConnectionManager()
  .create({
    database: config.CADEM_ABI_BI_DB.DB,
    entities: [],
    host: config.CADEM_ABI_BI_DB.SERVER,
    logging: false,
    password: config.CADEM_ABI_BI_DB.PASSWORD,
    port: config.CADEM_ABI_BI_DB.PORT_DB,
    synchronize: false,
    type: DIALECT,
    connectTimeout: 120000,
    username: config.CADEM_ABI_BI_DB.USER_DB,
  })
  .connect();

export const SUPI = new ConnectionManager()
  .create({
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
  })
  .connect();

export const MASTER = new ConnectionManager()
  .create({
    database: config.SOURCE_MASTER.DB,
    entities: [],
    host: config.SOURCE_MASTER.SERVER,
    logging: false,
    password: config.SOURCE_MASTER.PASSWORD,
    port: config.SOURCE_MASTER.PORT_DB,
    synchronize: false,
    connectTimeout: 120000,
    type: DIALECT,
    username: config.SOURCE_MASTER.USER_DB,
  })
  .connect();

export const PRINCIPAL = new ConnectionManager()
  .create({
    database: config.SOURCE_PRINCIPAL.DB,
    entities: [],
    host: config.SOURCE_PRINCIPAL.SERVER,
    logging: false,
    password: config.SOURCE_PRINCIPAL.PASSWORD,
    port: config.SOURCE_PRINCIPAL.PORT_DB,
    synchronize: false,
    connectTimeout: 120000,
    type: DIALECT,
    username: config.SOURCE_PRINCIPAL.USER_DB,
  })
  .connect();
