import { Injectable } from '@nestjs/common';
import { ClientesRepository } from './clientes.repository';
import { CrearClienteDto } from './dto/crear-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly clientesRepository: ClientesRepository) {}

  async findAll() {
    return this.clientesRepository.findAll();
  }

  async create(crearClienteDto: CrearClienteDto) {
    return this.clientesRepository.create(crearClienteDto);
  }

  async update(id: number, crearClienteDto: CrearClienteDto) {
    return this.clientesRepository.update(id, crearClienteDto);
  }

  async remove(id: number) {
  return this.clientesRepository.remove(id);
}
}
