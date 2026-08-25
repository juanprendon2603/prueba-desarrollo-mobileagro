import { calcularSalario } from './salario.js';

const form = document.querySelector<HTMLFormElement>('#salary-form');
const nombreInput = document.querySelector<HTMLInputElement>('#nombre');
const horasInput = document.querySelector<HTMLInputElement>('#horas');
const resultado = document.querySelector<HTMLDivElement>('#resultado');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombre = nombreInput?.value.trim() ?? '';
  const horas = Number(horasInput?.value);

  if (!nombre || Number.isNaN(horas) || horas < 0) {
    return;
  }

  const salario = calcularSalario(horas);

  resultado!.textContent =
    `Al Empleado ${nombre} se le debe pagar la suma de ${salario.toLocaleString('es-CO')} pesos.`;

  resultado!.classList.remove('hidden');
});