import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.producto.findMany();
  }

  async create(crearProductoDto: CrearProductoDto) {
    return this.prisma.producto.create({
      data: crearProductoDto,
    });
  }

  async update(id: number, crearProductoDto: CrearProductoDto) {
    return this.prisma.producto.update({
      where: { id },
      data: crearProductoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.producto.delete({
      where: { id },
    });
  }
}
