import * as chai from "chai";
import * as dotenv from "dotenv";
import { Application } from "express";
import { resolve } from "path";
import * as supertest from "supertest";
import { Connection } from "../src/config/database";
import { Server } from "../src/config/server";
import { UserService } from "../src/services";

const URI: string = "/store";
let token: string;
let IdRecord: string;

const server: Server = new Server();
let app: Application;

dotenv.config({ path: resolve() + "/.env" });

describe("ALL STORE TEST ROUTE", () => {

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

    it("SHOULD RETURN LIST STORE FOR USER", (done) => {
        supertest(app).get(`${URI}`).set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            const KEYS = [ "folio", "cod_local", "bandera", "direccion", "latitud", "longitud", "date_b2b", "mide",
            "realizada", "fecha_visita", "cadena", "venta_perdida",
            "descripcion", "osa", "pendiente", "visita_en_progreso", "hasPoll", "id_visita"];
            chai.expect(res.status).to.eq(200);
            chai.expect(res.body).to.be.a("array");
            for (const store of res.body) {
                chai.expect(store).to.be.a("object");
                chai.expect(store).to.have.all.keys(KEYS);
                chai.expect(store.folio);
                chai.expect(store.cod_local);
                chai.expect(store.bandera);
                chai.expect(store.cadena);
                chai.expect(store.direccion);
                chai.expect(store.descripcion);
                chai.expect(store.date_b2b);
                chai.expect(store.latitud);
                chai.expect(store.longitud);
                chai.expect(store.mide);
                chai.expect(store.realizada);
                chai.expect(store.visita_en_progreso);
                chai.expect(store.hasPoll);
                chai.expect(store.id_visita);
            }
            done();
        });
    });

    it("SHOULD RETURN ERROR 404", (done) => {
        supertest(app).get(`${URI}/099009090909`)
        .set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).to.eq(404, "404 error");
            chai.expect(res.body).to.be.a("object");
            done();
        });
    });

    it("SHOULD RETURN DETAIL STORE", (done) => {
        supertest(app).get(`${URI}/41065015`).set("Authorization", `bearer ${token}`).set("Accept", "application/json")
        .end((err, res) => {
            chai.expect(res.status).to.eq(200);
            chai.expect(res.body).to.be.a("object");
            chai.expect(res.body.cademsmart_porcentaje);
            chai.expect(res.body.venta_perdida).to.be.a("number");
            chai.expect(res.body.detail).to.be.a("array");
            for (const detail of res.body.detail) {
                chai.expect(detail.acciones).to.be.a("array");
                chai.expect(detail.casos).to.be.a("number");
                chai.expect(detail.categoria).to.be.a("string");
                chai.expect(detail.venta_perdida).to.be.a("number");
                for (const accion of detail.acciones) {
                chai.expect(accion.accion).to.be.a("string");
                chai.expect(accion.monto).to.be.a("number");
                }
            }
            done();
        });
    });

});
