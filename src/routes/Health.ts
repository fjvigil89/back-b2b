import { Response, Router } from "express";

export class HealthRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.router.use("", [], (_: any, res: Response) => {
      res.writeHead(200);
      res.end("OK");
    });
  }
}
