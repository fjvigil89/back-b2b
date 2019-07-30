import * as chai from "chai";
import * as dotenv from "dotenv";
import { Application } from "express";
import { resolve } from "path";
import * as supertest from "supertest";
import { Connection } from "../src/config/database";
import { Server } from "../src/config/server";
import { UserService } from "../src/services";

const URI: string = "/item";
let token: string;
let IdRecord: string;

const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL ITEM TEST ROUTE", () => {

    before((done) => {
        Connection
            .then(() => {
                IdRecord = "test";
                new UserService().validUser(IdRecord, "123")
                    .then((result) => {
                        token = result.token;
                        server.Start().then(() => {
                            app = server.App();
                            done();
                        });
                    });
            });
    });

    it("SHOULD RETURN LIST ITEMS", (done) => {
        supertest(app).get(`${URI}/23028003/SABORIZANTES PARA LECHE/Reponer`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).to.eq(200);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.detail).to.be.a("object");
            chai.expect(res.body.detail.data).to.be.a("array");
            chai.expect(res.body.detail.flag).to.be.a("boolean");
            const KEYS = ["cadem", "descripcion", "ean", "stock", "sventa"];
            for (const row of res.body.detail.data) {
                chai.expect(row).to.have.all.keys(KEYS);
                chai.expect(row.cadem);
                chai.expect(row.ean).to.be.a("string", "ean");
                chai.expect(row.stock).to.be.a("number", "stock");
                chai.expect(row.sventa).to.be.a("number", "sventa");
            }
            done();
        });
    });

});
