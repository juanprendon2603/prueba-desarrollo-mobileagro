export function calcularSalario(horasTrabajadas: number): number {
  if (horasTrabajadas <= 48) {
    return horasTrabajadas * 25000;
  }

  const horasExtras = horasTrabajadas - 48;

  return 48 * 25000 + horasExtras * 35000;
}