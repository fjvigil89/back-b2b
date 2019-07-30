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

const URI: string = "/likePost";
let token: string;
let IdRecordPost: number;
let IdRecordLikePost: number;

const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL LIKES COMMENT TEST ROUTE", () => {

    before((done) => {
        Connection
            .then(() => {
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

    it("SHOULD CREATE NEW LIKE POST", (done) => {
        supertest(app).post(`${URI}`)
        .send({ post_id: IdRecordPost })
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).eq(200);
            chai.expect(res.body.like).to.be.a("object");
            chai.expect(res.body.like).all.keys(["postId", "userId", "id"]);
            IdRecordLikePost = res.body.like.id;
            done();
        });
    });

    it("SHOULD RETURN ERROR 400 CREATE NEW LIKE COMMENT", (done) => {
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
            chai.expect(res.status).eq(200);
            chai.expect(res.body.likes).to.be.a("array");
            for (const row of res.body.likes) {
                chai.expect(row).all.keys(["id", "postId", "userId"]);
            }
            done();
        });
    });

    it("SHOULD REMOVE ONE LIKE COMMENT", (done) => {
        supertest(app).delete(`${URI}/${IdRecordLikePost}`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
        chai.expect(res.status).eq(200);
        done();
        });
    });

});
