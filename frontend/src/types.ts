export interface Cliente {
  id: number;
  nombreCliente: string;
  direccion: string;
}

export interface Producto {
  id: number;
  nombreProducto: string;
  valor: number;
}

export interface DetalleFactura {
  id: number;
  numero: number;
  productoId: number;
  cantidad: number;
  valor: number;
  producto?: Producto;
}

export interface Factura {
  numero: number;
  fecha: string;
  clienteId: number;
  total: number;
  cliente?: Cliente;
  detalles: DetalleFactura[];
}