import * as B2B_SERVICE from "../services/external/B2B";

export class DownloadService {

  public async getDataDownload(client: string, filtros: IFilterDataDownload): Promise<void> {
    const {
      fecha,
      retail,
    } = filtros;

    const data = await B2B_SERVICE.getDataMovimiento(client, fecha, retail);

    console.log(data);

    return data;
  }
}
