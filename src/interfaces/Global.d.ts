import * as express from "express";

interface IROUTER {
  path: string;
  middleware: any[];
  handler: express.Router;
}
