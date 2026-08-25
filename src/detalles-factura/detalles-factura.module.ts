import { Module } from '@nestjs/common';
import { DetallesFacturaController } from './detalles-factura.controller';
import { DetallesFacturaService } from './detalles-factura.service';
import { DetallesFacturaRepository } from './detalles-factura.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DetallesFacturaController],
  providers: [DetallesFacturaService, DetallesFacturaRepository],
})
export class DetallesFacturaModule {}
