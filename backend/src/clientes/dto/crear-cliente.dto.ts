import { IsNotEmpty, IsString } from 'class-validator';

export class CrearClienteDto {
  @IsString()
  @IsNotEmpty()
  nombreCliente: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;
}
