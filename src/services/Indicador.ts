import * as B2B_SERVICE from "./external/B2B";
import * as CADEM_ABI_SERVICE from "./external/CademAbiBi";

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

  public getBreaksDetail = async (idVisita: number): Promise<any> =>
    CADEM_ABI_SERVICE.getBreaksDetail(idVisita)
      .then((res) => res)
      .catch((err) => err);

  public getResume = async (idVisita: number): Promise<any> =>
    CADEM_ABI_SERVICE.getResume(idVisita)
      .then((res) => res)
      .catch((err) => err);

  public getOsaBreaksDetail = async (idVisita: number): Promise<any> =>
    CADEM_ABI_SERVICE.getOsaBreaksDetail(idVisita)
      .then((res) => res)
      .catch((err) => err);

  public getOsaResume = async (idVisita: number): Promise<any> =>
    CADEM_ABI_SERVICE.getOsaResume(idVisita)
      .then((res) => res)
      .catch((err) => err);

  public async getIndicatorByFolio(
    client: string,
    folio: number,
  ): Promise<any> {
    const indicators = await this.getIndicators(client, folio);
    const idVisit = await this.getLastVisit(client, folio);
    const breaksDetail = await this.getBreaksDetail(Number(idVisit));
    const resume = await this.getResume(Number(idVisit));
    const osaResume = await this.getOsaResume(Number(idVisit));
    const osaBreaks = await this.getOsaBreaksDetail(Number(idVisit));

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

  public async getIndicator(client: string, folio: number, indicador: string) {}
}
