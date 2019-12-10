interface IListPoll {
  id: number;
  nombre_encuesta: string;
  detalle_encuenta: string;
  id_sala_encuesta: number;
  bandera: string;
  cadena: string;
  cod_local: string;
  date_b2b: string;
  descripcion: string;
  direccion: string;
  fecha_visita: string;
  folio: number;
  latitud: string;
  longitud: string;
  mide: number;
  osa: number;
  realizada: number;
  venta_perdida: number;
  state: string;
}

interface IDetailPoll {
  id: number;
  item: string;
  response: string;
  tipo: string;
}

interface IGroupDetail {
  id: number;
  step: number;
  title: string;
  type: string;
  config?: Array<{
      id: number,
      text: string,
  }>;
}

interface IGroupList {
  description: string;
  available: number;
  listPolls: Array<{
      description: string,
      idPoll: number,
      state: string,
      title: string,
  }>;
}
