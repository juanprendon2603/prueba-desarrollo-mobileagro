import { Injectable } from '@nestjs/common';
import { ProductosRepository } from './productos.repository';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async findAll() {
    return this.productosRepository.findAll();
  }

  async create(crearProductoDto: CrearProductoDto) {
    return this.productosRepository.create(crearProductoDto);
  }

  async update(id: number, crearProductoDto: CrearProductoDto) {
    return this.productosRepository.update(id, crearProductoDto);
  }

  async remove(id: number) {
    return this.productosRepository.remove(id);
  }
}
