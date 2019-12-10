interface IDetailStore {
  cademsmart_porcentaje: number;
  venta_perdida: number;
  detail: IDetailItems[];
}

interface ILastStoreByDate {
  fecha_sin_venta: string | null;
  actualizacion_b2b: string;
  codLocal: string;
  retail: string;
}
