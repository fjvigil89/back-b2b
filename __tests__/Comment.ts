import * as chai from "chai";
import * as dotenv from "dotenv";
import { Application } from "express";
import * as moment from "moment";
import { resolve } from "path";
import * as supertest from "supertest";
import { Connection } from "../src/config/database";
import { Server } from "../src/config/server";
import { Post } from "../src/entity";
import { UserService } from "../src/services";

const URI: string = "/comment";
let token: string;
let IdRecordPost: number;
let IdRecordComment: number;

const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL COMMENTS TEST ROUTE", () => {

    before((done) => {
        Connection
            .then(() => {
                new UserService().validUser("test", "123")
                    .then((result) => {
                        token = result.token;
                        Post.create({
                            content: "",
                            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                            userId: "1",
                        }).save()
                            .then((post) => {
                                IdRecordPost = post.id;
                                server.Start().then(() => {
                                    app = server.App();
                                    done();
                                });
                            });
                    });
            });
    });

    after((done) => {
        Post.delete(IdRecordPost)
            .then(() => {
                done();
            });
    });

    it("SHOULD CREATE NEW COMMENT", (done) => {
        supertest(app).post(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .send({ post_id: IdRecordPost, content: "bla bla bla" })
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.comment).to.be.a("object");
            chai.expect(res.body.comment.content).to.be.a("string");
            chai.expect(res.body.comment.userId).to.be.a("string");
            chai.expect(res.body.comment.date).to.be.a("string");
            chai.expect(res.body.comment.id).to.be.a("number");
            IdRecordComment = res.body.comment.id;
            done();
        });
    });

    it("SHOULD RETURN ERROR 400 CREATE NEW COMMENT", (done) => {
        supertest(app).post(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(400);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.message).to.be.a("string");
            done();
        });
    });

    it("SHOULD RETURN LIST COMMENT", (done) => {
        supertest(app).get(`${URI}/post/${IdRecordPost}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            const KEYS = ["content",
                "currentDate",
                "date",
                "enableLike",
                "id",
                "replies",
                "totalLikes",
                "totalReplies",
                "userId",
                "userName",
                "image",
            ];
            chai.expect(res.status).eq(200);
            chai.expect(res.body.comments).to.be.a("array");
            for (const row of res.body.comments) {
                chai.expect(row).all.keys(KEYS);
            }
            done();
        });
    });

    it("SHOULD RETURN LIST COMMENT", (done) => {
        supertest(app).get(`${URI}/post/12121212`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.comments).to.be.a("array");
            chai.expect(res.body.comments.length).eq(0);
            done();
        });
    });

    it("SHOULD RETURN FIND ONE COMMENT", (done) => {
        supertest(app).get(`${URI}/${IdRecordComment}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            const KEYS = ["content",
                "currentDate",
                "date",
                "enableLike",
                "id",
                "replies",
                "totalLikes",
                "totalReplies",
                "userId",
                "userName",
                "image",
            ];
            chai.expect(res.status).eq(200);
            chai.expect(res.body.comment).to.be.a("object");
            chai.expect(res.body.comment).all.keys(KEYS);
            done();
        });
    });

    it("SHOULD REMOVE ONE COMMENT", (done) => {
        supertest(app).delete(`${URI}/${IdRecordComment}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            done();
        });
    });

});
