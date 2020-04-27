import * as moment from "moment";
import * as B2B_SERVICE from "./external/B2B";

export class VentasService {
    private today: string;
    private initialMonth: string;
    private finishMonth: string;
    private initialMonthLastYear: string;
    private todayLastYear: string;

    constructor() {
        this.today = moment().format("YYYY-MM-DD");
        this.initialMonth = moment().startOf('month').format('YYYY-MM-DD');
        this.finishMonth = moment().endOf('month').format('YYYY-MM-DD');

        this.initialMonthLastYear = moment().subtract(1, "year").startOf("month").format("YYYY-MM-DD");
        this.todayLastYear = moment().subtract(1, "year").format("YYYY-MM-DD");
    }

    public async getInformation(
        client: string,
        cod_local: string,
        retail: string
    ): Promise<any[]> {
        const data = await Promise.all([
            B2B_SERVICE.getMTB(client, cod_local, retail, this.today, this.initialMonth),
            B2B_SERVICE.getMTBLY(client, cod_local, retail, this.todayLastYear, this.initialMonthLastYear),
            B2B_SERVICE.getTarget(client, cod_local, retail, this.initialMonth, this.finishMonth)
        ])

        const retorno = {
            mtb: data[0].length ? parseInt(data[0][0].venta_valor) : 0,
            mtbly: data[1].length ? parseInt(data[1][0].venta_valor) : 0,
            target: data[2].length ? parseInt(data[2][0].target) : 0
        }

        const cumplimiento_number = retorno.mtb - retorno.target
        const cumplimiento_porc = retorno.target === 0 ? retorno.mtb * 100 : Math.round(retorno.mtb * 100 / retorno.target)

        const cumplimientoly_number = retorno.mtb - retorno.mtbly
        const cumplimientoly_porc = Math.round(retorno.mtb * 100 / retorno.mtbly)

        return {
            ...retorno,
            cumplimiento_number,
            cumplimiento_porc,
            cumplimientoly_number,
            cumplimientoly_porc
        }
    }
}
