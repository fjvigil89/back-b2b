import * as B2B_SERVICE from "./external/B2B";

class HotNews {
  public getAcComercialAndCatalogos = async (
    client: string,
    codLocal: string,
    retail: string,
    bandera: string,
  ): Promise<any> => {
    try {
      const acuerdosComerciales = await B2B_SERVICE.getAcuerdosComerciales(
        client,
        retail,
        codLocal,
      );
      console.log("acuerdos", acuerdosComerciales);
      const catalogos = await B2B_SERVICE.getCatalogos(client, retail, bandera);
      console.log("catalogos", catalogos);
      return {
        acuerdos_comerciales: acuerdosComerciales,
        catalogos,
      };
    } catch (err) {
      console.log("err", err);
    }
  };
}

export default HotNews;
