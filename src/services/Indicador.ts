import * as B2B_SERVICE from "./external/B2B";
import * as SMARTWEB_SERVICE from "./external/SmartWeb";

export class Indicator {
  public async getIndicators(
    client: string,
    folio: number,
  ): Promise<
    [
      {
        indicador: string;
        nota: number;
        fecha: string;
      },
    ]
  > {
    try {
      const data = await B2B_SERVICE.getIndicators(client, folio);
      console.log("indicadores", data);
      return data;
    } catch (err) {
      console.log("Error indicators: ", err);
      throw new Error("Error al obtener indicadores");
    }
  }

  public async getLastVisit(client: string, folio: number): Promise<any> {
    try {
      console.log("FOLIO", folio);
      const result = await B2B_SERVICE.getLastVisitByIndicators(client, folio);
      return result;
    } catch (err) {
      return err;
    }
  }

  public getBreaksDetail = async (
    client: string,
    idVisita: number,
  ): Promise<any> =>
    SMARTWEB_SERVICE.getBreaksDetail(client, idVisita)
      .then((res) => res)
      .catch((err) => err);

  public getResume = async (client: string, idVisita: number): Promise<any> =>
    SMARTWEB_SERVICE.getResume(client, idVisita)
      .then((res) => res)
      .catch((err) => err);

  public getOsaBreaksDetail = async (
    client: string,
    idVisita: number,
  ): Promise<any> =>
    SMARTWEB_SERVICE.getOsaBreaksDetail(client, idVisita)
      .then((res) => res)
      .catch((err) => err);

  public getOsaResume = async (
    client: string,
    idVisita: number,
  ): Promise<any> =>
    SMARTWEB_SERVICE.getOsaResume(client, idVisita)
      .then((res) => res)
      .catch((err) => err);

  public async getIndicatorByFolio(
    client: string,
    folio: number,
  ): Promise<any> {
    const indicators = await this.getIndicators(client, folio);
    const idVisit = await this.getLastVisit(client, folio);
    const breaksDetail = await this.getBreaksDetail(client, Number(idVisit));
    const resume = await this.getResume(client, Number(idVisit));
    const osaResume = await this.getOsaResume(client, Number(idVisit));
    const osaBreaks = await this.getOsaBreaksDetail(client, Number(idVisit));

    const indicatorsArr = [];
    let obj = {};
    let lastScores = {};
    for (const item of indicators) {
      console.time("for");
      const indicador = await B2B_SERVICE.getIndicator(
        client,
        folio,
        item.indicador,
      );
      for (const ind of indicador) {
        console.log("ind", ind);
        const indicatorKey = ind.indicador;
        const nota = ind.nota;
        if (!Object.keys(obj).includes(indicatorKey)) {
          lastScores = { ...lastScores, [indicatorKey]: [] };
          if (indicatorKey === "Osa") {
            obj = {
              ...obj,
              [indicatorKey]: {
                name: indicatorKey,
                score: nota,
                inScore: false,
                diff: null,
                lastIndicators: [],
                detail: { ...osaResume, productos: osaBreaks },
              },
            };
          } else if (indicatorKey === "Catalogo") {
            obj = {
              ...obj,
              [indicatorKey]: {
                name: indicatorKey,
                score: nota,
                inScore: false,
                diff: null,
                lastIndicators: [],
                detail: { ...resume, productos: breaksDetail },
              },
            };
          } else {
            obj = {
              ...obj,
              [indicatorKey]: {
                name: indicatorKey,
                score: nota,
                inScore: false,
                diff: null,
                lastIndicators: [],
              },
            };
          }
        } else {
          lastScores = {
            ...lastScores,
            [indicatorKey]: [...lastScores[indicatorKey], nota],
          };
          const diff = lastScores[indicatorKey].length
            ? obj[indicatorKey].score - lastScores[indicatorKey][0]
            : null;
          obj[indicatorKey].lastIndicators = lastScores[indicatorKey];
          obj[indicatorKey].diff = diff && diff.toFixed(4);
        }
      }
    }
    const totalScore = { totalScore: null };
    const indicadores = Object.keys(obj).map((key) => obj[key]);
    const data = { ...totalScore, indicadores };
    return data;
  }
}
