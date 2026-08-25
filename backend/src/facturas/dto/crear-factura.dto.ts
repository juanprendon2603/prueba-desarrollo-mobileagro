import { IsInt, Min } from 'class-validator';

export class CrearFacturaDto {
  @IsInt()
  @Min(1)
  clienteId: number;
}
