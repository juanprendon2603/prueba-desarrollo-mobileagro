import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearFacturaDto } from './dto/crear-factura.dto';

@Injectable()
export class FacturasRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.cabezaFactura.findMany({
      include: {
        cliente: true,
        detalles: true,
      },
    });
  }

  async create(crearFacturaDto: CrearFacturaDto) {
    return this.prisma.cabezaFactura.create({
      data: {
        ...crearFacturaDto,
        total: 0,
      },
      include: {
        cliente: true,
      },
    });
  }

  async remove(numero: number) {
    return this.prisma.cabezaFactura.delete({
      where: { numero },
    });
  }
}
