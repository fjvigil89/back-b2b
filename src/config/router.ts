import * as express from "express";
import * as jwt from "express-jwt";
import {
    CasesRouter,
    CheckRouter,
    CommentRouter,
    DownloadRouter,
    HashtagRouter,
    ImageRouter,
    ItemRouter,
    LikeCommentRouter,
    LikePostRouter,
    LikeReplyRouter,
    NotificationRouter,
    PollRouter,
    PostRouter,
    QuestionRouter,
    ReplyRouter,
    StoreRouter,
    SummaryRouter,
    UserRouter,
} from "../routes";
import { config } from "./config";

interface IROUTER {
    path: string;
    middleware: any[];
    handler: express.Router;
}

const Cases = new CasesRouter();
const Check = new CheckRouter();
const Comment = new CommentRouter();
const Download = new DownloadRouter();
const Hashtag = new HashtagRouter();
const Item = new ItemRouter();
const LikeComment = new LikeCommentRouter();
const LikePost = new LikePostRouter();
const LikeReply = new LikeReplyRouter();
const Notification = new NotificationRouter();
const Poll = new PollRouter();
const Post = new PostRouter();
const Reply = new ReplyRouter();
const Store = new StoreRouter();
const Summary = new SummaryRouter();
const User = new UserRouter();
const Image = new ImageRouter();
const Question = new QuestionRouter();

export const ROUTER: IROUTER[] = [{
    handler: User.router,
    middleware: [],
    path: "/auth",
}, {
    handler: Store.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/store",
}, {
    handler: Item.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/item",
}, {
    handler: Post.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/post",
}, {
    handler: Comment.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/comment",
}, {
    handler: Reply.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/reply",
}, {
    handler: LikePost.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/likePost",
}, {
    handler: LikeComment.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/likeComment",
}, {
    handler: LikeReply.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/likeReply",
}, {
    handler: Poll.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/encuesta",
}, {
    handler: Hashtag.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/hashtag",
}, {
    handler: Check.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/check",
}, {
    handler: Summary.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/summary",
}, {
    handler: Cases.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/cases",
}, {
    handler: Image.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/image",
}, {
    handler: Download.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/download",
}, {
    handler: Question.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/question",
}, {
    handler: Notification.router,
    middleware: [jwt({ secret: config.SECRET })],
    path: "/notification",
}];
