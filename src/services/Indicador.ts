import * as B2B_SERVICE from "./external/B2B";

const DUMMY_DATA = [
  {
    indicador: "Cartel",
    fecha: "2020-06-17T04:00:00.000Z",
    folio: 41073001,
    nota: 0.45,
  },
  {
    indicador: "Fleje",
    fecha: "2020-06-17T04:00:00.000Z",
    folio: 41073001,
    nota: 1,
  },
  {
    indicador: "Osa",
    fecha: "2020-06-17T04:00:00.000Z",
    folio: 41073001,
    nota: 1,
  },
  {
    indicador: "Cartel",
    fecha: "2020-06-16T04:00:00.000Z",
    folio: 41073001,
    nota: 0.5,
  },
  {
    indicador: "Fleje",
    fecha: "2020-06-16T04:00:00.000Z",
    folio: 41073001,
    nota: 0.7,
  },
  {
    indicador: "Osa",
    fecha: "2020-06-16T04:00:00.000Z",
    folio: 41073001,
    nota: 0.8,
  },
  {
    indicador: "Cartel",
    fecha: "2020-06-15T04:00:00.000Z",
    folio: 41073001,
    nota: 0.34,
  },
  {
    indicador: "Fleje",
    fecha: "2020-06-15T04:00:00.000Z",
    folio: 41073001,
    nota: 0.67,
  },
  {
    indicador: "Osa",
    fecha: "2020-06-15T04:00:00.000Z",
    folio: 41073001,
    nota: 0.75,
  },
];

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
    const data = await B2B_SERVICE.getIndicators(client, folio);
    return data;
  }
  public async getIndicatorByFolioTest(): Promise<any> {
    let obj = {};
    let lastScores = {};
    for (const item of DUMMY_DATA) {
      const nota = item.nota;
      const indicatorKey = item.indicador;
      if (!Object.keys(obj).includes(indicatorKey)) {
        lastScores = { ...lastScores, [indicatorKey]: [] };
        obj = {
          ...obj,
          [indicatorKey]: {
            name: indicatorKey,
            score: nota,
            inScore: false,
            diff: 0,
            lastIndicators: [],
          },
        };
      } else {
        lastScores = {
          ...lastScores,
          [indicatorKey]: [...lastScores[indicatorKey], nota],
        };
        const diff = obj[indicatorKey].score - lastScores[indicatorKey][0];
        obj[indicatorKey].lastIndicators = lastScores[indicatorKey];
        obj[indicatorKey].diff = diff.toFixed(2);
      }
    }
    const totalScore = { totalScore: null };
    const indicators = Object.keys(obj).map((key) => obj[key]);
    const data = { ...totalScore, indicadores: [...indicators] };
    return data;
  }

  public async getIndicatorByFolio(
    client: string,
    folio: number,
  ): Promise<any> {
    const indicators = await this.getIndicators(client, folio);
    const indicatorsArr = [];
    let obj = {};
    let lastScores = {};
    for (const item of indicators) {
      const indicador = await B2B_SERVICE.getIndicator(
        client,
        folio,
        item.indicador,
      );
      const nota = indicador[0].nota;
      const indicatorKey = indicador[0].indicador;
      if (!Object.keys(obj).includes(indicatorKey)) {
        lastScores = { ...lastScores, [indicatorKey]: [] };
        obj = {
          ...obj,
          [indicatorKey]: {
            name: indicatorKey,
            score: nota,
            inScore: false,
            diff: 0,
            lastIndicators: [],
          },
        };
      } else {
        lastScores = {
          ...lastScores,
          [indicatorKey]: [...lastScores[indicatorKey], nota],
        };
        const diff = obj[indicatorKey].score - lastScores[indicatorKey][0];
        obj[indicatorKey].lastIndicators = lastScores[indicatorKey];
        obj[indicatorKey].diff = diff.toFixed(2);
      }
    }
    const totalScore = { totalScore: null };
    const indicadores = Object.keys(obj).map((key) => obj[key]);
    const data = { ...totalScore, indicadores };
    return data;
  }

  public async getIndicator(client: string, folio: number, indicador: string) {}
}
