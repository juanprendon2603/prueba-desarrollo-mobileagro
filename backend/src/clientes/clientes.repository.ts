import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearClienteDto } from './dto/crear-cliente.dto';

@Injectable()
export class ClientesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cliente.findMany();
  }

  async create(crearClienteDto: CrearClienteDto) {
    return this.prisma.cliente.create({
      data: crearClienteDto,
    });
  }

  async update(id: number, crearClienteDto: CrearClienteDto) {
    return this.prisma.cliente.update({
      where: { id },
      data: crearClienteDto,
    });
  }

  async remove(id: number) {
  return this.prisma.cliente.delete({
    where: { id },
  });
}

}
