import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CrearClienteDto } from './dto/crear-cliente.dto';

@Controller('clientes')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Get()
    async findAll() {
        return this.clientesService.findAll();
    }

    @Post()
    async create(@Body() crearClienteDto: CrearClienteDto) {
        return this.clientesService.create(crearClienteDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() crearClienteDto: CrearClienteDto,
    ) {
        return this.clientesService.update(Number(id), crearClienteDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.clientesService.remove(Number(id));
    }

}
