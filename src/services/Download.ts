import * as B2B_SERVICE from "../services/external/B2B";

interface IFilterDataDownload {
  fecha: string;
  retail: string;
}

export class DownloadService {

    public async getDataDownload(filtros: IFilterDataDownload): Promise<void> {
      const {
        fecha,
        retail,
      } = filtros;

      const data = await B2B_SERVICE.getDataMovimiento(fecha, retail);

      console.log(data);

      return data;
    }
}
