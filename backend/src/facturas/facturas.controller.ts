import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { CrearFacturaDto } from './dto/crear-factura.dto';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get()
  async findAll() {
    return this.facturasService.findAll();
  }

  @Post()
  async create(@Body() crearFacturaDto: CrearFacturaDto) {
    return this.facturasService.create(crearFacturaDto);
  }

  @Delete(':numero')
  async remove(@Param('numero') numero: string) {
    return this.facturasService.remove(Number(numero));
  }
}
