import { IsInt, Min } from 'class-validator';

export class CrearDetalleFacturaDto {
  @IsInt()
  @Min(1)
  numero: number;

  @IsInt()
  @Min(1)
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}