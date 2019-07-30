import * as cluster from "cluster";
import * as dotenv from "dotenv";
import { cpus } from "os";
import { resolve } from "path";
import { env } from "process";
import { config } from "./config/config";
import { Server } from "./config/server";
import { CheckScheduler, StoreScheduler } from "./scheduler";

process.on("unhandledRejection", (reason, promise) => {
    promise.catch((err) => console.log(err));
});

if (env.NODE_ENV === "PRODUCTION") {
    console.log("Cargando archivo de producción");
    dotenv.config({ path: resolve() + "/.env" });
} else {
    console.log("Cargando archivo de desarrollo");
    dotenv.config({ path: resolve() + "/.env" });
}

if (env.NODE_ENV === "PRODUCTION") {
    StoreScheduler();
    CheckScheduler.start();
}

const port: number = Number(env.PORT) || config.PORT_APP || 3000;
new Server().Start().then((server) => {
        server.listen(port);
        server.on("error", (error: any) => {
            if (error.syscall !== "listen") {
                throw error;
            }
            const bind = typeof port === "string"
            ? "Pipe " + port
            : "Port " + port;
            switch (error.code) {
                case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
                case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
                default:
                throw error;
            }
        });
        server.on("listening", () => {
            const addr = server.address();
            const bind = typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr.port;
            console.log("Server is running in process " + process.pid + " listening on PORT " + port + "\n");
        });
    });
