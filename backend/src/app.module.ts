import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { FacturasModule } from './facturas/facturas.module';
import { DetallesFacturaModule } from './detalles-factura/detalles-factura.module';

@Module({
  imports: [ClientesModule, PrismaModule, ProductosModule, FacturasModule, DetallesFacturaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
