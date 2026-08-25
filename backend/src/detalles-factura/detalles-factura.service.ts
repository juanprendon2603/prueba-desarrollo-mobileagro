import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearDetalleFacturaDto } from './dto/crear-detalle-factura.dto';
import { DetallesFacturaRepository } from './detalles-factura.repository';

@Injectable()
export class DetallesFacturaService {
  constructor(
    private readonly detallesFacturaRepository: DetallesFacturaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.detallesFacturaRepository.findAll();
  }

  async create(crearDetalleFacturaDto: CrearDetalleFacturaDto) {
    const factura = await this.prisma.cabezaFactura.findUnique({
      where: { numero: crearDetalleFacturaDto.numero },
    });

    if (!factura) {
      throw new BadRequestException('La factura no existe');
    }

    const producto = await this.prisma.producto.findUnique({
      where: { id: crearDetalleFacturaDto.productoId },
    });

    if (!producto) {
      throw new BadRequestException('El producto no existe');
    }

    const valor = producto.valor * crearDetalleFacturaDto.cantidad;

    const detalle = await this.detallesFacturaRepository.create({
      ...crearDetalleFacturaDto,
      valor,
    });

    const detalles = await this.prisma.detalleFactura.findMany({
      where: { numero: crearDetalleFacturaDto.numero },
    });

    const total = detalles.reduce(
      (acumulado, detalle) => acumulado + detalle.valor,
      0,
    );

    await this.prisma.cabezaFactura.update({
      where: { numero: crearDetalleFacturaDto.numero },
      data: { total },
    });

    return detalle;
  }

  async remove(id: number) {
    const detalle = await this.prisma.detalleFactura.delete({
      where: { id },
    });

    const detalles = await this.prisma.detalleFactura.findMany({
      where: { numero: detalle.numero },
    });

    const total = detalles.reduce(
      (acumulado, detalle) => acumulado + detalle.valor,
      0,
    );

    await this.prisma.cabezaFactura.update({
      where: { numero: detalle.numero },
      data: { total },
    });

    return detalle;
  }
}
