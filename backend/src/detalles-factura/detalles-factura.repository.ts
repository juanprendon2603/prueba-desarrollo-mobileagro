import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearDetalleFacturaDto } from './dto/crear-detalle-factura.dto';

@Injectable()
export class DetallesFacturaRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.detalleFactura.findMany({
      include: {
        producto: true,
        factura: true,
      },
    });
  }

  async create(
    crearDetalleFacturaDto: CrearDetalleFacturaDto & { valor: number },
  ) {
    return this.prisma.detalleFactura.create({
      data: crearDetalleFacturaDto,
      include: {
        producto: true,
        factura: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.detalleFactura.delete({
      where: { id },
    });
  }
}
