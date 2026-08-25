import { Module } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { FacturasRepository } from './facturas.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FacturasController],
  providers: [FacturasService, FacturasRepository],
})
export class FacturasModule {}
