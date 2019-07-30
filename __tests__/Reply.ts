import * as chai from "chai";
import * as dotenv from "dotenv";
import { Application } from "express";
import * as moment from "moment";
import { resolve } from "path";
import * as supertest from "supertest";
import { Connection } from "../src/config/database";
import { Server } from "../src/config/server";
import { Comment, Post } from "../src/entity";
import { UserService } from "../src/services";

const URI: string = "/reply";
let token: string;
let IdRecordPost: number;
let IdRecordComment: number;
let IdRecordReply: number;

const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL COMMENTS TEST ROUTE", () => {

    before((done) => {
        Connection.then(() => {
        return new UserService().validUser("test", "123")
        .then((result) => {
            token = result.token;
            return Post.create({
                content: "",
                date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                userId: "1",
            }).save();
        }).then((post) => {
            IdRecordPost = post.id;
            return Comment.create({
                content: "",
                date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                postId: IdRecordPost,
                userId: "1",
            }).save();
        }).then((comment) => {
            IdRecordComment = comment.id;
            server.Start().then(() => {
                app = server.App();
                done();
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

    it("SHOULD CREATE NEW REPLY", (done) => {
        supertest(app).post(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .send({ comment_id: IdRecordComment, content: "bla bla bla" })
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.reply).to.be.a("object");
            chai.expect(res.body.reply.content).to.be.a("string");
            chai.expect(res.body.reply.commentId).to.be.a("number");
            chai.expect(res.body.reply.userId).to.be.a("string");
            chai.expect(res.body.reply.date).to.be.a("string");
            chai.expect(res.body.reply.id).to.be.a("number");
            IdRecordReply = res.body.reply.id;
            done();
        });
    });

    it("SHOULD RETURN ERROR 400 CREATE NEW REPLY", (done) => {
        supertest(app).post(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(400);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.message).to.be.a("string");
            done();
        });
    });

    it("SHOULD RETURN LIST REPLY", (done) => {
        supertest(app).get(`${URI}/comment/${IdRecordComment}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.replies).to.be.a("array");
            for (const row of res.body.replies) {
                chai.expect(row).all.keys(["id", "content", "commentId", "userId", "date", "image"]);
            }
            done();
        });
    });

    it("SHOULD UPDATE COMMENT", (done) => {
        supertest(app).put(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .send({ content: "bla bla bla", reply_id: IdRecordReply })
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            done();
        });
    });

    it("SHOULD RETURN ERROR 400 UPDATE REPLY", (done) => {
        supertest(app).put(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(400);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.message).to.be.a("string");
            done();
        });
    });

    it("SHOULD RETURN FIND ONE REPLY", (done) => {
        supertest(app).get(`${URI}/${IdRecordReply}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.reply).to.be.a("object");
            chai.expect(res.body.reply).all.keys(["id", "commentId", "userId", "date", "content", "image"]);
            done();
        });
    });

    it("SHOULD REMOVE ONE REPLY", (done) => {
        supertest(app).delete(`${URI}/${IdRecordReply}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            done();
        });
    });

});
