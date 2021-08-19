[1mdiff --cc src/controllers/StoreController.ts[m
[1mindex 43ad219,1c42d3e..0000000[m
[1m--- a/src/controllers/StoreController.ts[m
[1m+++ b/src/controllers/StoreController.ts[m
[36m@@@ -1,54 -1,75 +1,103 @@@[m
  import { Request, Response } from "express";[m
[31m- import { StoreService } from "../services";[m
[32m++import { Store } from "../entity";[m
[32m+ import { StoreService, ItemService } from "../services";[m
  import { Controller } from "./Controller";[m
  [m
  export class StoreController extends Controller {[m
[32m +  private storeService: StoreService;[m
[31m- [m
[32m++  private itemService: ItemService;[m
[32m +  constructor(req: Request, res: Response) {[m
[32m +    super(req, res);[m
[32m +    this.storeService = new StoreService();[m
[32m++    this.itemService = new ItemService();[m
[32m +  }[m
  [m
[31m -    private storeService: StoreService;[m
[31m -    private itemService: ItemService[m
[32m +  public async list(): Promise<Response> {[m
[32m +    const { userId, client } = this.req.user as {[m
[32m +      userId: string;[m
[32m +      client: string;[m
[32m +    };[m
  [m
[31m -    constructor(req: Request, res: Response) {[m
[31m -        super(req, res);[m
[31m -        this.storeService = new StoreService();[m
[31m -        this.itemService = new ItemService();[m
[32m +    try {[m
[32m +      const Stores = await this.storeService.listStoreUser(client, userId);[m
[32m +      return this.res.status(200).json(Stores);[m
[32m +    } catch (ex) {[m
[32m +      return this.res.status(500).send();[m
      }[m
[32m +  }[m
  [m
[31m -    public async list(): Promise<Response> {[m
[31m -        const { userId, client } = this.req.user as { userId: string, client: string };[m
[31m -        try {[m
[31m -            const Stores = await this.storeService.listStoreUser(client, userId);[m
[31m -            return this.res.status(200).json(Stores);[m
[31m -        } catch (ex) {[m
[31m -            return this.res.status(500).send();[m
[31m -        }[m
[31m -    }[m
[32m +  public async find(): Promise<Response> {[m
[32m +    const folio: string = this.req.params.folio;[m
[32m +    const { client } = this.req.user;[m
[32m +    try {[m
[32m +      const version: string = this.req.params.version;[m
  [m
[31m -    public async find(): Promise<Response> {[m
[31m -        const folio: string = this.req.params.folio;[m
[31m -        const { client } = this.req.user;[m
[31m -        try {[m
[31m -            const Stores = await this.storeService.groupStore(client, Number(folio));[m
[31m -            if (Stores) {[m
[31m -                return this.res.status(200).send(Stores);[m
[31m -            } else {[m
[31m -                return this.res.status(404).send();[m
[31m -            }[m
[31m -        } catch (ex) {[m
[31m -            console.error(ex);[m
[31m -            return this.res.status(500).send();[m
[31m -        }[m
[32m +      let envioVersion = 1;[m
[32m +      if (version) {[m
[32m +        envioVersion = parseInt(version);[m
[32m +      }[m
[32m +[m
[32m +      const Stores = await this.storeService.groupStore([m
[32m +        client,[m
[32m +        Number(folio),[m
[32m +        envioVersion,[m
[32m +      );[m
[32m +[m
[32m +      if (Stores) {[m
[32m +        return this.res.status(200).send(Stores);[m
[32m +      } else {[m
[32m +        return this.res.status(404).send();[m
[32m +      }[m
[32m +    } catch (ex) {[m
[32m +      console.error(ex);[m
[32m +      return this.res.status(500).send();[m
      }[m
[32m +  }[m
[32m++[m
[32m++  public async findOffline(): Promise<Response> {[m
[32m++    console.log('entro al controlador')[m
[32m++    const folio: string = this.req.params.folio;[m
[32m++    const { client } = this.req.user;[m
[32m++    try {[m
[32m++      const version: string = this.req.params.version;[m
[32m+ [m
[31m -    public async findOffline(): Promise<Response> {[m
[31m -        const folio: string = this.req.params.folio;[m
[31m -        const { client } = this.req.user;[m
[31m -        try {[m
[31m -            const Stores = await this.storeService.groupStore(client, Number(folio));[m
[31m -            if (Stores) {[m
[31m -                for await (let detail of Stores.detail) {[m
[31m -                    let category = detail.categoria[m
[31m -                    let arrAcciones = [][m
[31m -                    for await (let acciones of detail.acciones) {[m
[31m -                        let action = acciones.accion[m
[31m -                        const productos = await this.itemService.detailItemsAction(client, Number(folio), category, action);[m
[31m -                        arrAcciones.push({[m
[31m -                            accion: acciones["accion"],[m
[31m -                            gestionado: acciones["gestionado"],[m
[31m -                            casos_gestionados: acciones["casos_gestionados"],[m
[31m -                            cantidad: acciones["cantidad"],[m
[31m -                            monto: acciones["monto"],[m
[31m -                            productos: productos.data[m
[31m -                        })[m
[31m -                        detail.acciones = arrAcciones[m
[31m -                    }[m
[31m -                }[m
[31m -                return this.res.status(200).send(Stores);[m
[31m -            } else {[m
[31m -                return this.res.status(404).send();[m
[31m -            }[m
[31m -        } catch (ex) {[m
[31m -            console.error(ex);[m
[31m -            return this.res.status(500).send();[m
[32m++      let envioVersion = 1;[m
[32m++      if (version) {[m
[32m++        envioVersion = parseInt(version);[m
[32m++      }[m
[32m++[m
[32m++      const Stores = await this.storeService.groupStore([m
[32m++        client,[m
[32m++        Number(folio),[m
[32m++        envioVersion,[m
[32m++      );[m
[32m++      if (Stores) {[m
[32m++        for await (let detail of Stores.detail) {[m
[32m++          let category = detail.categoria[m
[32m++          let arrAcciones = [][m
[32m++          [m
[32m++          for await (let acciones of detail.acciones) {[m
[32m++            let action = acciones.accion[m
[32m++            const productos = await this.itemService.detailItemsActionOffline(client, Number(folio), category, action);[m
[32m++            arrAcciones.push({[m
[32m++              accion: acciones["accion"],[m
[32m++              gestionado: acciones["gestionado"],[m
[32m++              casos_gestionados: acciones["casos_gestionados"],[m
[32m++              cantidad: acciones["cantidad"],[m
[32m++              monto: acciones["monto"],[m
[32m++              productos: productos.data,[m
[32m++              cambio: 0[m
[32m++            })[m
[32m++            detail.acciones = arrAcciones[m
[32m++          }[m
[32m+         }[m
[32m++        return this.res.status(200).send(Stores);[m
[32m++      } else {[m
[32m++        return this.res.status(404).send();[m
[32m++      }[m
[32m++    } catch (ex) {[m
[32m++      console.error(ex);[m
[32m++      return this.res.status(500).send();[m
[32m+     }[m
[31m -[m
[32m++  }[m
  }[m
[1mdiff --cc src/routes/Store.ts[m
[1mindex 99aba72,ebbab9f..0000000[m
[1m--- a/src/routes/Store.ts[m
[1m+++ b/src/routes/Store.ts[m
[36m@@@ -4,19 -4,15 +4,21 @@@[m [mimport { Router } from "./Router"[m
  import { validator } from "./SchemaValidator";[m
  [m
  export class StoreRouter extends Router {[m
[31m -    constructor() {[m
[31m -        super(StoreController);[m
[31m -        this.router[m
[31m -            .get("", [], this.handler(StoreController.prototype.list))[m
[31m -            .get("/:folio", [[m
[31m -                validator(findSchema),[m
[31m -            ], this.handler(StoreController.prototype.find))[m
[31m -            .get("/offline/:folio/", [[m
[31m -                validator(findSchema),[m
[31m -            ], this.handler(StoreController.prototype.findOffline));[m
[31m -    }[m
[32m +  constructor() {[m
[32m +    super(StoreController);[m
[32m +    this.router[m
[32m +      .get("", [], this.handler(StoreController.prototype.list))[m
[32m +      .get([m
[32m +        "/:folio",[m
[32m +        [validator(findSchema)],[m
[32m +        this.handler(StoreController.prototype.find),[m
[32m +      )[m
[32m +      .get([m
[32m +        "/:folio/:version",[m
[32m +        [validator(findSchema)],[m
[32m +        this.handler(StoreController.prototype.find),[m
[31m-       );[m
[32m++      )[m
[32m++      .get("/offline/:folio/:version",[m
[32m++      [], this.handler(StoreController.prototype.findOffline));[m
[32m +  }[m
  }[m
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex 390798b..6f54bb4 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -954,6 +954,15 @@[m
         "unset-value": "^1.0.0"[m
       }[m
     },[m
[32m+[m[32m    "call-bind": {[m
[32m+[m[32m      "version": "1.0.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.2.tgz",[m
[32m+[m[32m      "integrity": "sha512-7O+FbCihrB5WGbFYesctwmTKae6rOiIzmz1icreWJ+0aA7LJfuqhEso2T9ncpcFtzMQtzXf2QGGueWJGTYsqrA==",[m
[32m+[m[32m      "requires": {[m
[32m+[m[32m        "function-bind": "^1.1.1",[m
[32m+[m[32m        "get-intrinsic": "^1.0.2"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "camelcase": {[m
       "version": "5.3.1",[m
       "resolved": "https://registry.npmjs.org/camelcase/-/camelcase-5.3.1.tgz",[m
[36m@@ -1725,8 +1734,94 @@[m
           "integrity": "sha512-VT/cxmx5yaoHSOTSyrCygIDFco+RsibY2NM0a4RdEeY/4KgqezwFtK1yr3U67xYhqJSlASm2pKhLVzPj2lr4bA==",[m
           "requires": {[m
             "define-properties": "^1.1.3",[m
[32m+[m[32m            "es-abstract": "^1.18.0-next.0",[m
             "has-symbols": "^1.0.1",[m
             "object-keys": "^1.1.1"[m
[32m+[m[32m          },[m
[32m+[m[32m          "dependencies": {[m
[32m+[m[32m            "es-abstract": {[m
[32m+[m[32m              "version": "1.18.5",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.18.5.tgz",[m
[32m+[m[32m              "integrity": "sha512-DDggyJLoS91CkJjgauM5c0yZMjiD1uK3KcaCeAmffGwZ+ODWzOkPN4QwRbsK5DOFf06fywmyLci3ZD8jLGhVYA==",[m
[32m+[m[32m              "requires": {[m
[32m+[m[32m                "call-bind": "^1.0.2",[m
[32m+[m[32m                "es-to-primitive": "^1.2.1",[m
[32m+[m[32m                "function-bind": "^1.1.1",[m
[32m+[m[32m                "get-intrinsic": "^1.1.1",[m
[32m+[m[32m                "has": "^1.0.3",[m
[32m+[m[32m                "has-symbols": "^1.0.2",[m
[32m+[m[32m                "internal-slot": "^1.0.3",[m
[32m+[m[32m                "is-callable": "^1.2.3",[m
[32m+[m[32m                "is-negative-zero": "^2.0.1",[m
[32m+[m[32m                "is-regex": "^1.1.3",[m
[32m+[m[32m                "is-string": "^1.0.6",[m
[32m+[m[32m                "object-inspect": "^1.11.0",[m
[32m+[m[32m                "object-keys": "^1.1.1",[m
[32m+[m[32m                "string.prototype.trimend": "^1.0.4",[m
[32m+[m[32m                "string.prototype.trimstart": "^1.0.4",[m
[32m+[m[32m                "unbox-primitive": "^1.0.1"[m
[32m+[m[32m              },[m
[32m+[m[32m              "dependencies": {[m
[32m+[m[32m                "has-symbols": {[m
[32m+[m[32m                  "version": "1.0.2",[m
[32m+[m[32m                  "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.2.tgz",[m
[32m+[m[32m                  "integrity": "sha512-chXa79rL/UC2KlX17jo3vRGz0azaWEx5tGqZg5pO3NUyEJVB17dMruQlzCCOfUvElghKcm5194+BCRvi2Rv/Gw=="[m
[32m+[m[32m                }[m
[32m+[m[32m              }[m
[32m+[m[32m            },[m
[32m+[m[32m            "is-callable": {[m
[32m+[m[32m              "version": "1.2.4",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.4.tgz",[m
[32m+[m[32m              "integrity": "sha512-nsuwtxZfMX67Oryl9LCQ+upnC0Z0BgpwntpS89m1H/TLF0zNfzfLMV/9Wa/6MZsj0acpEjAO0KF1xT6ZdLl95w=="[m
[32m+[m[32m            },[m
[32m+[m[32m            "is-negative-zero": {[m
[32m+[m[32m              "version": "2.0.1",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.1.tgz",[m
[32m+[m[32m              "integrity": "sha512-2z6JzQvZRa9A2Y7xC6dQQm4FSTSTNWjKIYYTt4246eMTJmIo0Q+ZyOsU66X8lxK1AbB92dFeglPLrhwpeRKO6w=="[m
[32m+[m[32m            },[m
[32m+[m[32m            "is-regex": {[m
[32m+[m[32m              "version": "1.1.4",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.1.4.tgz",[m
[32m+[m[32m              "integrity": "sha512-kvRdxDsxZjhzUX07ZnLydzS1TU/TJlTUHHY4YLL87e37oUA49DfkLqgy+VjFocowy29cKvcSiu+kIv728jTTVg==",[m
[32m+[m[32m              "requires": {[m
[32m+[m[32m                "call-bind": "^1.0.2",[m
[32m+[m[32m                "has-tostringtag": "^1.0.0"[m
[32m+[m[32m              }[m
[32m+[m[32m            },[m
[32m+[m[32m            "object-inspect": {[m
[32m+[m[32m              "version": "1.11.0",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.11.0.tgz",[m
[32m+[m[32m              "integrity": "sha512-jp7ikS6Sd3GxQfZJPyH3cjcbJF6GZPClgdV+EFygjFLQ5FmW/dRUnTd9PQ9k0JhoNDabWFbpF1yCdSWCC6gexg=="[m
[32m+[m[32m            },[m
[32m+[m[32m            "object.assign": {[m
[32m+[m[32m              "version": "4.1.2",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.2.tgz",[m
[32m+[m[32m              "integrity": "sha512-ixT2L5THXsApyiUPYKmW+2EHpXXe5Ii3M+f4e+aJFAHao5amFRW6J0OO6c/LU8Be47utCx2GL89hxGB6XSmKuQ==",[m
[32m+[m[32m              "requires": {[m
[32m+[m[32m                "call-bind": "^1.0.0",[m
[32m+[m[32m                "define-properties": "^1.1.3",[m
[32m+[m[32m                "has-symbols": "^1.0.1",[m
[32m+[m[32m                "object-keys": "^1.1.1"[m
[32m+[m[32m              }[m
[32m+[m[32m            },[m
[32m+[m[32m            "string.prototype.trimend": {[m
[32m+[m[32m              "version": "1.0.4",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.4.tgz",[m
[32m+[m[32m              "integrity": "sha512-y9xCjw1P23Awk8EvTpcyL2NIr1j7wJ39f+k6lvRnSMz+mz9CGz9NYPelDk42kOz6+ql8xjfK8oYzy3jAP5QU5A==",[m
[32m+[m[32m              "requires": {[m
[32m+[m[32m                "call-bind": "^1.0.2",[m
[32m+[m[32m                "define-properties": "^1.1.3"[m
[32m+[m[32m              }[m
[32m+[m[32m            },[m
[32m+[m[32m            "string.prototype.trimstart": {[m
[32m+[m[32m              "version": "1.0.4",[m
[32m+[m[32m              "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.4.tgz",[m
[32m+[m[32m              "integrity": "sha512-jh6e984OBfvxS50tdY2nRZnoC5/mLFKOREQfw8t5yytkoUsJRNxvI/E39qu1sD0OtWI3OC0XgKSmcWwziwYuZw==",[m
[32m+[m[32m              "requires": {[m
[32m+[m[32m                "call-bind": "^1.0.2",[m
[32m+[m[32m                "define-properties": "^1.1.3"[m
[32m+[m[32m              }[m
[32m+[m[32m            }[m
           }[m
         }[m
       }[m
[36m@@ -2219,6 +2314,16 @@[m
       "integrity": "sha1-6td0q+5y4gQJQzoGY2YCPdaIekE=",[m
       "dev": true[m
     },[m
[32m+[m[32m    "get-intrinsic": {[m
[32m+[m[32m      "version": "1.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-kWZrnVM42QCiEA2Ig1bG8zjoIMOgxWwYCEeNdwY6Tv/cOSeGpcoX4pXHfKUxNKVoArnrEr2e9srnAxxGIraS9Q==",[m
[32m+[m[32m      "requires": {[m
[32m+[m[32m        "function-bind": "^1.1.1",[m
[32m+[m[32m        "has": "^1.0.3",[m
[32m+[m[32m        "has-symbols": "^1.0.1"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "get-stdin": {[m
       "version": "4.0.1",[m
       "resolved": "https://registry.npmjs.org/get-stdin/-/get-stdin-4.0.1.tgz",[m
[36m@@ -2354,6 +2459,11 @@[m
         "ansi-regex": "^2.0.0"[m
       }[m
     },[m
[32m+[m[32m    "has-bigints": {[m
[32m+[m[32m      "version": "1.0.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.0.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-LSBS2LjbNBTf6287JEbEzvJgftkF5qFkmCo9hDRpAzKhUOlJ+hx8dd4USs00SgsUNwc4617J9ki5YtEClM2ffA=="[m
[32m+[m[32m    },[m
     "has-flag": {[m
       "version": "4.0.0",[m
       "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",[m
[36m@@ -2364,6 +2474,21 @@[m
       "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.1.tgz",[m
       "integrity": "sha512-PLcsoqu++dmEIZB+6totNFKq/7Do+Z0u4oT0zKOJNl3lYK6vGwwu2hjHs+68OEZbTjiUE9bgOABXbP/GvrS0Kg=="[m
     },[m
[32m+[m[32m    "has-tostringtag": {[m
[32m+[m[32m      "version": "1.0.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-kFjcSNhnlGV1kyoGk7OXKSawH5JOb/LzUc5w9B02hOTO0dfFRjbHQKvg1d6cf3HbeUmtU9VbbV3qzZ2Teh97WQ==",[m
[32m+[m[32m      "requires": {[m
[32m+[m[32m        "has-symbols": "^1.0.2"[m
[32m+[m[32m      },[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "has-symbols": {[m
[32m+[m[32m          "version": "1.0.2",[m
[32m+[m[32m          "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.0.2.tgz",[m
[32m+[m[32m          "integrity": "sha512-chXa79rL/UC2KlX17jo3vRGz0azaWEx5tGqZg5pO3NUyEJVB17dMruQlzCCOfUvElghKcm5194+BCRvi2Rv/Gw=="[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "has-unicode": {[m
       "version": "2.0.1",[m
       "resolved": "https://registry.npmjs.org/has-unicode/-/has-unicode-2.0.1.tgz",[m
[36m@@ -2510,6 +2635,16 @@[m
       "resolved": "https://registry.npmjs.org/ini/-/ini-1.3.5.tgz",[m
       "integrity": "sha512-RZY5huIKCMRWDUqZlEi72f/lmXKMvuszcMBduliQ3nnWbx9X/ZBQO7DijMEYS9EhHBb2qacRUMtC7svLwe0lcw=="[m
     },[m
[32m+[m[32m    "internal-slot": {[m
[32m+[m[32m      "version": "1.0.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.0.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-O0DB1JC/sPyZl7cIo78n5dR7eUSwwpYPiXRhTzNxZVAMUuB8vlnRFyLxdrVToks6XPLVnFfbzaVd5WLjhgg+vA==",[m
[32m+[m[32m      "requires": {[m
[32m+[m[32m        "get-intrinsic": "^1.1.0",[m
[32m+[m[32m        "has": "^1.0.3",[m
[32m+[m[32m        "side-channel": "^1.0.4"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
     "ipaddr.js": {[m
       "version": "1.9.1",[m
       "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",[m
[36m@@ -2546,6 +2681,11 @@[m
       "resolved": "https://registry.npmjs.org/is-arrayish/-/is-arrayish-0.3.2.tgz",[m
       "integrity": "sha512-eVRqCvVlZbuw3GrM63ovNSNAeA1K16kaR/LRY/92w0zxQ5/1YzwblUX652i4Xs9RwAGjW9d9y6X88t8OaAJfWQ=="[m
     },[m
[32m+[m[32m    "is-bigint": {[m
[32m+[m[32m      "version": "1.0.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.0.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-ZU538ajmYJmzysE5yU4Y7uIrPQ2j704u+hXFiIPQExpqzzUbpe5jCPdTfmz7jXRxZdvjY3KZ3ZNenoXQovX+Dg=="[m
[32m+[m[32m    },[m
     "is-binary-path": {[m
       "version": "1.0.1",[m
       "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-1.0.1.tgz",[m
[36m@@ -2555,6 +2695,15 @@[m
         "binary-extensions": "^1.0.0"[m
       }[m
     },[m
[32m+[m[32m    "is-boolean-object": {[m
[32m+[m[32m      "version": "1.1.2",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolea