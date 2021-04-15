interface IItemsAction {
  flag: boolean;
  data: Array<{
    ean: number;
    descripcion: string;
    stock_transito?: number;
    sventa: number;
    cadem: number;
    gestionado: number;
  }>;
}

interface IDetailItems {
  categoria: string;
  casos: number;
  venta_perdida: number;
  acciones: Array<{ accion: string; monto: number }>;
}

interface IItemCase {
  ean: number;
  folio: number;
  stock: number;
  description: string;
  category: string;
  accion: string;
  cadem: number;
  venta_perdida: number;
  stock_pedido_tienda: number;
  dias_sin_venta: number;
  gestionado: number;
  venta_unidades: number;
  uqc: string;
  qc: string;
  plu: number;
}

interface IDetailItem {
  stock: number;
  ean: number;
  stockPedidoTienda: number;
  diasSinVenta: number;
  itemId: number;
  promedioVentas: number;
  ventaUnidades: number;
}
