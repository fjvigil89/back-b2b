import * as chai from "chai";
import * as dotenv from "dotenv";
import { Application } from "express";
import { resolve } from "path";
import * as supertest from "supertest";
import { Connection } from "../src/config/database";
import { Server } from "../src/config/server";
import { UserService } from "../src/services";

const URI: string = "/post";
let token: string;
let IdRecordPost: number;

const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL COMMENTS TEST ROUTE", () => {

    before((done) => {
        Connection
        .then(() => {
            new UserService().validUser("test", "123")
            .then((result) => {
                console.log(result);
                token = result.token;
                server.Start().then(() => {
                app = server.App();
                done();
                });
            });
        });
    });

    it("SHOULD CREATE NEW POST", (done) => {
        supertest(app).post(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .send({ content: "bla bla bla" })
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.post).to.be.a("object");
            chai.expect(res.body.post.content).to.be.a("string");
            chai.expect(res.body.post.userId).to.be.a("string");
            chai.expect(res.body.post.date).to.be.a("string");
            chai.expect(res.body.post.id).to.be.a("number");
            IdRecordPost = res.body.post.id;
            done();
        });
    });

    it("SHOULD RETURN ERROR 400 CREATE NEW POST", (done) => {
        supertest(app).post(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(400);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.message).to.be.a("string");
            done();
        });
    });

    it("SHOULD RETURN LIST POST", (done) => {
        supertest(app).get(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            const KEYS = [
                "content",
                "currentDate",
                "date",
                "enableLike",
                "id",
                "images",
                "totalComments",
                "totalLikes",
                "userId",
                "userName",
            ];
            chai.expect(res.status).eq(200);
            chai.expect(res.body.posts).to.be.a("array");
            for (const row of res.body.posts) {
                chai.expect(row).all.keys(KEYS);
            }
            done();
        });
    });

    it("SHOULD RETURN ONE POST", (done) => {
        supertest(app).get(`${URI}/${IdRecordPost}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            const KEYS = [
                "content",
                "currentDate",
                "date",
                "enableLike",
                "id",
                "images",
                "totalComments",
                "totalLikes",
                "userId",
                "userName",
            ];
            chai.expect(res.status).eq(200);
            chai.expect(res.body.post).to.be.a("object");
            chai.expect(res.body.post).all.keys(KEYS);
            done();
        });
    });

    it("SHOULD UPDATE POST", (done) => {
        supertest(app).put(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .send({ post_id: IdRecordPost, content: "bla bla bla" })
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            done();
        });
    });

    it("SHOULD RETURN ERROR 400 UPDATE POST", (done) => {
        supertest(app).put(`${URI}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(400);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.message).to.be.a("string");
            done();
        });
    });

    it("SHOULD REMOVE ONE COMMENT", (done) => {
        supertest(app).delete(`${URI}/${IdRecordPost}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            done();
        });
    });

});
