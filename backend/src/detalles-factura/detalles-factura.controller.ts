import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DetallesFacturaService } from './detalles-factura.service';
import { CrearDetalleFacturaDto } from './dto/crear-detalle-factura.dto';

@Controller('detalles-factura')
export class DetallesFacturaController {
  constructor(
    private readonly detallesFacturaService: DetallesFacturaService,
  ) {}

  @Get()
  async findAll() {
    return this.detallesFacturaService.findAll();
  }

  @Post()
  async create(@Body() crearDetalleFacturaDto: CrearDetalleFacturaDto) {
    return this.detallesFacturaService.create(crearDetalleFacturaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.detallesFacturaService.remove(Number(id));
  }
}
