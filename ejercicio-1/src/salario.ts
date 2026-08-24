import readlineSync from 'readline-sync';

const nombre = readlineSync.question('Ingrese el nombre del empleado: ');
const horasTrabajadas = Number(
  readlineSync.question('Ingrese las horas trabajadas: '),
);

let salario: number;

if (horasTrabajadas <= 48) {
  salario = horasTrabajadas * 25000;
} else {
  const horasExtras = horasTrabajadas - 48;

  salario = 48 * 25000 + horasExtras * 35000;
}

console.log(
  `Al Empleado ${nombre} se le debe pagar la suma de ${salario} pesos.`,
);