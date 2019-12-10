import * as express from "express";

interface IRouter {
  path: string;
  middleware: any[];
  handler: express.Router;
}
