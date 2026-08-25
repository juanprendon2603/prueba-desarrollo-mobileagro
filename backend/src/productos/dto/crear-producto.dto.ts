import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CrearProductoDto {
  @IsString()
  @IsNotEmpty()
  nombreProducto: string;

  @IsNumber()
  @Min(0)
  valor: number;
}
