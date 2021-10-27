import { Request, Response } from "express";
import { Store } from "../entity";
import { StoreService, ItemService } from "../services";
import { Controller } from "./Controller";

export class StoreController extends Controller {
  private storeService: StoreService;
  private itemService: ItemService;
  constructor(req: Request, res: Response) {
    super(req, res);
    this.storeService = new StoreService();
    this.itemService = new ItemService();
  }

  public async list(): Promise<Response> {
    const { userId, client } = this.req.user as {
      userId: string;
      client: string;
    };

    try {
      const Stores = await this.storeService.listStoreUser(client, userId);
      return this.res.status(200).json(Stores);
    } catch (ex) {
      return this.res.status(500).send();
    }
  }

  public async listV2(): Promise<Response> {
    const { userId, client } = this.req.user as {
      userId: string;
      client: string;
    };

    try {
      const Stores = await this.storeService.listStoreUserV2(client, userId);
      return this.res.status(200).json(Stores);
    } catch (ex) {
      return this.res.status(500).send();
    }
  }

  public async find(): Promise<Response> {
    const folio: string = this.req.params.folio;
    const { client } = this.req.user;
    try {
      const version: string = this.req.params.version;

      let envioVersion = 1;
      if (version) {
        envioVersion = parseInt(version);
      }

      const Stores = await this.storeService.groupStore(
        client,
        Number(folio),
        envioVersion,
      );

      if (Stores) {
        return this.res.status(200).send(Stores);
      } else {
        return this.res.status(404).send();
      }
    } catch (ex) {
      console.error(ex);
      return this.res.status(500).send();
    }
  }

  public async findOffline(): Promise<Response> {
    console.log("entro al controlador");
    const folio: string = this.req.params.folio;
    const { client } = this.req.user;
    try {
      const version: string = this.req.params.version;

      let envioVersion = 1;
      if (version) {
        envioVersion = parseInt(version);
      }

      const Stores = await this.storeService.groupStore(
        client,
        Number(folio),
        envioVersion,
      );
      if (Stores) {
        for await (let detail of Stores.detail) {
          let category = detail.categoria;
          let arrAcciones = [];

          for await (let acciones of detail.acciones) {
            let action = acciones.accion;
            const productos = await this.itemService.detailItemsActionOffline(
              client,
              Number(folio),
              category,
              action,
            );
            arrAcciones.push({
              accion: acciones["accion"],
              gestionado: acciones["gestionado"],
              casos_gestionados: acciones["casos_gestionados"],
              cantidad: acciones["cantidad"],
              monto: acciones["monto"],
              productos: productos.data,
              cambio: 0,
            });
            detail.acciones = arrAcciones;
          }
        }
        return this.res.status(200).send(Stores);
      } else {
        return this.res.status(404).send();
      }
    } catch (ex) {
      console.error(ex);
      return this.res.status(500).send();
    }
  }
}
