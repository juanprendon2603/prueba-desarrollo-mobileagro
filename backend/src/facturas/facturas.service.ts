import { BadRequestException, Injectable } from '@nestjs/common';
import { FacturasRepository } from './facturas.repository';
import { CrearFacturaDto } from './dto/crear-factura.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacturasService {
  constructor(
    private readonly facturasRepository: FacturasRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.facturasRepository.findAll();
  }

  async create(crearFacturaDto: CrearFacturaDto) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: crearFacturaDto.clienteId },
    });

    if (!cliente) {
      throw new BadRequestException('El cliente no existe');
    }

    return this.facturasRepository.create(crearFacturaDto);
  }

  async remove(numero: number) {
    return this.facturasRepository.remove(numero);
  }
}
