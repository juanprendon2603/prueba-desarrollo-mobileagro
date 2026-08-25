import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CrearProductoDto } from './dto/crear-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll() {
    return this.productosService.findAll();
  }

  @Post()
  async create(@Body() crearProductoDto: CrearProductoDto) {
    return this.productosService.create(crearProductoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() crearProductoDto: CrearProductoDto,
  ) {
    return this.productosService.update(Number(id), crearProductoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productosService.remove(Number(id));
  }
}
