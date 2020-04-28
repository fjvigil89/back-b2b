import * as moment from "moment";
import * as B2B_SERVICE from "./external/B2B";

export class VentasService {
    private today: string;
    private initialMonth: string;
    private finishMonth: string;
    private initialMonthLastYear: string;
    private todayLastYear: string;
    private initialYear: string;
    private initialYearLastYear: string;

    constructor() {
        this.today = moment().format("YYYY-MM-DD");
        this.initialMonth = moment().startOf('month').format('YYYY-MM-DD');
        this.finishMonth = moment().endOf('month').format('YYYY-MM-DD');

        this.initialMonthLastYear = moment().subtract(1, "year").startOf("month").format("YYYY-MM-DD");
        this.todayLastYear = moment().subtract(1, "year").format("YYYY-MM-DD");

        this.initialYear = moment().startOf('year').format('YYYY-MM-DD');
        this.initialYearLastYear = moment().subtract(1, "year").startOf("year").format("YYYY-MM-DD");
    }

    public async getInformation(
        client: string,
        cod_local: string,
        retail: string
    ): Promise<{}> {
        const data = await Promise.all([
            B2B_SERVICE.getMTB(client, cod_local, retail, this.today, this.initialMonth),
            B2B_SERVICE.getMTBLY(client, cod_local, retail, this.todayLastYear, this.initialMonthLastYear),
            B2B_SERVICE.getTarget(client, cod_local, retail, this.initialMonth, this.finishMonth),
            B2B_SERVICE.getYTB(client, cod_local, retail, this.today, this.initialYear),
            B2B_SERVICE.getYTBLY(client, cod_local, retail, this.todayLastYear, this.initialYearLastYear),
            B2B_SERVICE.getTargetYear(client, cod_local, retail, this.initialYear, this.finishMonth),
        ])
        
        const retorno = {
            mtb: data[0].length ? parseInt(data[0][0].venta_valor) : 0,
            mtbly: data[1].length ? parseInt(data[1][0].venta_valor) : 0,
            target: data[2].length ? parseInt(data[2][0].target) : 0,
            ytb: data[3].length ? parseInt(data[3][0].venta_valor) : 0,
            ytbly: data[4].length ? parseInt(data[4][0].venta_valor) : 0,
            targetYear: data[5].length ? parseInt(data[5][0].target) : 0,
        }

        const cumplimiento_number = retorno.mtb - retorno.target
        const cumplimiento_porc = retorno.target === 0 ? retorno.mtb * 100 : Math.round(retorno.mtb * 100 / retorno.target)

        const cumplimientoly_number = retorno.mtb - retorno.mtbly
        const cumplimientoly_porc = Math.round(retorno.mtb * 100 / retorno.mtbly)

        const cumplimiento_number_year = retorno.ytb - retorno.targetYear
        const cumplimiento_porc_year = retorno.targetYear === 0 ? retorno.ytb * 100 : Math.round(retorno.ytb * 100 / retorno.targetYear)

        const cumplimientoly_number_year = retorno.ytb - retorno.ytbly
        const cumplimientoly_porc_year = Math.round(retorno.ytb * 100 / retorno.ytbly)

        return {
            ...retorno,
            cumplimiento_number,
            cumplimiento_porc,
            cumplimientoly_number,
            cumplimientoly_porc,
            cumplimiento_number_year,
            cumplimiento_porc_year,
            cumplimientoly_number_year,
            cumplimientoly_porc_year
        }
    }
}
