import * as chai from "chai";
import * as dotenv from "dotenv";
import { Application } from "express";
import { resolve } from "path";
import * as supertest from "supertest";
import { Server } from "../src/config/server";

const URI: string = "/auth";
const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL AUTH USER TEST ROUTE", () => {

    before((done) => {
        server.Start().then(() => {
            app = server.App();
            done();
        });
    });

    it("SHOULD RETURN TOKEN USER SIGN IN", (done) => {
        supertest(app).post(URI).send({
            password: "123",
            userId: "test",
        })
        .end((err, res) => {
            chai.expect(res.status).to.eq(200);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.token).to.be.a("string");
            done();
        });
    });

    it("SHOULD RETURN ERROR", (done) => {
        supertest(app).post(URI).send({
            password: "112112",
            userId: "12345121212",
        })
        .end((err, res) => {
            chai.expect(res.status).to.eq(404);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.message).to.be.a("string");
            chai.expect(res.body.message).eq("No existe el usuario");
            done();
        });
    });

});
