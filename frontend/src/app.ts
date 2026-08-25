const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://prueba-desarrollo-mobileagro.onrender.com';


import type {
  Cliente,
  Producto,
  Factura,
} from './types';

import { mostrarFacturaModal } from './factura-modal.js';

interface ProductoFactura {
  productoId: number;
  nombreProducto: string;
  valor: number;
  cantidad: number;
  subtotal: number;
}

// =========================
// Estado
// =========================

let clientes: Cliente[] = [];
let productos: Producto[] = [];
let facturas: Factura[] = [];
let detallesFactura: ProductoFactura[] = [];

// =========================
// Elementos - navegación
// =========================

const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');

const sections = document.querySelectorAll<HTMLElement>('.section');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const sectionId = tab.dataset.section;

    if (!sectionId) {
      return;
    }

    tabs.forEach((item) => item.classList.remove('active'));
    sections.forEach((section) => section.classList.remove('active'));

    tab.classList.add('active');

    const section = document.getElementById(sectionId);

    if (section) {
      section.classList.add('active');
    }

    if (sectionId === 'clientes') {
      void cargarClientes();
    }

    if (sectionId === 'productos') {
      void cargarProductos();
    }

    if (sectionId === 'facturas') {
      void cargarFacturas();
    }
  });
});

// =========================
// Notificaciones
// =========================

const notification =
  document.querySelector<HTMLDivElement>('#notification')!;

let notificationTimeout: ReturnType<typeof setTimeout> | undefined;

function mostrarMensaje(
  texto: string,
  tipo: 'success' | 'error',
): void {
  notification.textContent = texto;
  notification.className = `notification ${tipo}`;

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  notificationTimeout = setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// =========================
// CLIENTES
// =========================

const clienteForm =
  document.querySelector<HTMLFormElement>('#clienteForm')!;

const clienteFormContainer =
  document.querySelector<HTMLDivElement>('#clienteFormContainer')!;

const clienteIdInput =
  document.querySelector<HTMLInputElement>('#clienteId')!;

const nombreClienteInput =
  document.querySelector<HTMLInputElement>('#nombreCliente')!;

const direccionClienteInput =
  document.querySelector<HTMLInputElement>('#direccionCliente')!;

const btnNuevoCliente =
  document.querySelector<HTMLButtonElement>('#btnNuevoCliente')!;

const btnCancelarCliente =
  document.querySelector<HTMLButtonElement>('#btnCancelarCliente')!;

const clientesTableBody =
  document.querySelector<HTMLTableSectionElement>('#clientesTableBody')!;

async function cargarClientes(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`);

    if (!response.ok) {
      throw new Error('No fue posible consultar los clientes.');
    }

    clientes = await response.json();

    renderizarClientes();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'Error al consultar los clientes.',
      'error',
    );
  }
}

function renderizarClientes(): void {
  clientesTableBody.innerHTML = '';

  if (clientes.length === 0) {
    clientesTableBody.innerHTML = `
      <tr>
        <td colspan="4">
          No hay clientes registrados.
        </td>
      </tr>
    `;

    return;
  }

  clientes.forEach((cliente) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${cliente.id}</td>
      <td>${cliente.nombreCliente}</td>
      <td>${cliente.direccion}</td>
      <td>
        <div class="actions">
          <button
            class="secondary-button"
            data-action="edit"
            data-id="${cliente.id}"
          >
            Editar
          </button>

          <button
            class="danger-button"
            data-action="delete"
            data-id="${cliente.id}"
          >
            Eliminar
          </button>
        </div>
      </td>
    `;

    clientesTableBody.appendChild(row);
  });
}

btnNuevoCliente.addEventListener('click', () => {
  clienteForm.reset();
  clienteIdInput.value = '';

  clienteFormContainer.classList.remove('hidden');
  nombreClienteInput.focus();
});

btnCancelarCliente.addEventListener('click', () => {
  limpiarFormularioCliente();
});

clienteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nombreCliente = nombreClienteInput.value.trim();
  const direccion = direccionClienteInput.value.trim();
  const id = clienteIdInput.value;

  if (!nombreCliente || !direccion) {
    mostrarMensaje('Todos los campos son obligatorios.', 'error');
    return;
  }

  try {
    if (id) {
      await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCliente,
          direccion,
        }),
      });

      mostrarMensaje(
        'Cliente actualizado correctamente.',
        'success',
      );
    } else {
      await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCliente,
          direccion,
        }),
      });

      mostrarMensaje(
        'Cliente creado correctamente.',
        'success',
      );
    }

    limpiarFormularioCliente();
    await cargarClientes();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'No fue posible guardar el cliente.',
      'error',
    );
  }
});

clientesTableBody.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('button');

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'edit') {
    editarCliente(id);
  }

  if (action === 'delete') {
    await eliminarCliente(id);
  }
});

function editarCliente(id: number): void {
  const cliente = clientes.find((item) => item.id === id);

  if (!cliente) {
    return;
  }

  clienteIdInput.value = String(cliente.id);
  nombreClienteInput.value = cliente.nombreCliente;
  direccionClienteInput.value = cliente.direccion;

  clienteFormContainer.classList.remove('hidden');

  nombreClienteInput.focus();
}

async function eliminarCliente(id: number): Promise<void> {
  const cliente = clientes.find((item) => item.id === id);

  if (!cliente) {
    return;
  }

  const confirmar = window.confirm(
    `¿Deseas eliminar al cliente "${cliente.nombreCliente}"?`,
  );

  if (!confirmar) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/clientes/${id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('No fue posible eliminar el cliente.');
    }

    mostrarMensaje(
      'Cliente eliminado correctamente.',
      'success',
    );

    await cargarClientes();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'No fue posible eliminar el cliente.',
      'error',
    );
  }
}

function limpiarFormularioCliente(): void {
  clienteForm.reset();
  clienteIdInput.value = '';
  clienteFormContainer.classList.add('hidden');
}

// =========================
// PRODUCTOS
// =========================

const productoForm =
  document.querySelector<HTMLFormElement>('#productoForm')!;

const productoFormContainer =
  document.querySelector<HTMLDivElement>('#productoFormContainer')!;

const productoIdInput =
  document.querySelector<HTMLInputElement>('#productoId')!;

const nombreProductoInput =
  document.querySelector<HTMLInputElement>('#nombreProducto')!;

const valorProductoInput =
  document.querySelector<HTMLInputElement>('#valorProducto')!;

const btnNuevoProducto =
  document.querySelector<HTMLButtonElement>('#btnNuevoProducto')!;

const btnCancelarProducto =
  document.querySelector<HTMLButtonElement>('#btnCancelarProducto')!;

const productosTableBody =
  document.querySelector<HTMLTableSectionElement>('#productosTableBody')!;

async function cargarProductos(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`);

    if (!response.ok) {
      throw new Error('No fue posible consultar los productos.');
    }

    productos = await response.json();

    renderizarProductos();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'Error al consultar los productos.',
      'error',
    );
  }
}

function renderizarProductos(): void {
  productosTableBody.innerHTML = '';

  if (productos.length === 0) {
    productosTableBody.innerHTML = `
      <tr>
        <td colspan="4">
          No hay productos registrados.
        </td>
      </tr>
    `;

    return;
  }

  productos.forEach((producto) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombreProducto}</td>
      <td>${formatearMoneda(producto.valor)}</td>
      <td>
        <div class="actions">
          <button
            class="secondary-button"
            data-action="edit"
            data-id="${producto.id}"
          >
            Editar
          </button>

          <button
            class="danger-button"
            data-action="delete"
            data-id="${producto.id}"
          >
            Eliminar
          </button>
        </div>
      </td>
    `;

    productosTableBody.appendChild(row);
  });
}

btnNuevoProducto.addEventListener('click', () => {
  productoForm.reset();
  productoIdInput.value = '';

  productoFormContainer.classList.remove('hidden');
  nombreProductoInput.focus();
});

btnCancelarProducto.addEventListener('click', () => {
  limpiarFormularioProducto();
});

productoForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nombreProducto = nombreProductoInput.value.trim();
  const valor = Number(valorProductoInput.value);
  const id = productoIdInput.value;

  if (!nombreProducto || !Number.isFinite(valor) || valor < 0) {
    mostrarMensaje(
      'Ingresa un nombre y un valor válido.',
      'error',
    );

    return;
  }

  try {
    const response = await fetch(
      id
        ? `${API_BASE_URL}/productos/${id}`
        : `${API_BASE_URL}/productos`,
      {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreProducto,
          valor,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        id
          ? 'No fue posible actualizar el producto.'
          : 'No fue posible crear el producto.',
      );
    }

    mostrarMensaje(
      id
        ? 'Producto actualizado correctamente.'
        : 'Producto creado correctamente.',
      'success',
    );

    limpiarFormularioProducto();

    await cargarProductos();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'No fue posible guardar el producto.',
      'error',
    );
  }
});

productosTableBody.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('button');

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'edit') {
    editarProducto(id);
  }

  if (action === 'delete') {
    await eliminarProducto(id);
  }
});

function editarProducto(id: number): void {
  const producto = productos.find((item) => item.id === id);

  if (!producto) {
    return;
  }

  productoIdInput.value = String(producto.id);
  nombreProductoInput.value = producto.nombreProducto;
  valorProductoInput.value = String(producto.valor);

  productoFormContainer.classList.remove('hidden');

  nombreProductoInput.focus();
}

async function eliminarProducto(id: number): Promise<void> {
  const producto = productos.find((item) => item.id === id);

  if (!producto) {
    return;
  }

  const confirmar = window.confirm(
    `¿Deseas eliminar el producto "${producto.nombreProducto}"?`,
  );

  if (!confirmar) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/productos/${id}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error(
        'No fue posible eliminar el producto.',
      );
    }

    mostrarMensaje(
      'Producto eliminado correctamente.',
      'success',
    );

    await cargarProductos();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'No fue posible eliminar el producto.',
      'error',
    );
  }
}

function limpiarFormularioProducto(): void {
  productoForm.reset();
  productoIdInput.value = '';
  productoFormContainer.classList.add('hidden');
}

// =========================
// FACTURAS
// =========================

const facturaForm =
  document.querySelector<HTMLFormElement>('#facturaForm')!;

const facturaFormContainer =
  document.querySelector<HTMLDivElement>('#facturaFormContainer')!;

const facturaClienteSelect =
  document.querySelector<HTMLSelectElement>('#facturaCliente')!;

const facturaProductoSelect =
  document.querySelector<HTMLSelectElement>('#facturaProducto')!;

const facturaCantidadInput =
  document.querySelector<HTMLInputElement>('#facturaCantidad')!;

const btnNuevaFactura =
  document.querySelector<HTMLButtonElement>('#btnNuevaFactura')!;

const btnCancelarFactura =
  document.querySelector<HTMLButtonElement>('#btnCancelarFactura')!;

const btnAgregarProducto =
  document.querySelector<HTMLButtonElement>('#btnAgregarProducto')!;

const facturaDetallesBody =
  document.querySelector<HTMLTableSectionElement>(
    '#facturaDetallesBody',
  )!;

const facturaTotal =
  document.querySelector<HTMLElement>('#facturaTotal')!;

const facturasTableBody =
  document.querySelector<HTMLTableSectionElement>(
    '#facturasTableBody',
  )!;

async function cargarFacturas(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/facturas`);

    if (!response.ok) {
      throw new Error('No fue posible consultar las facturas.');
    }

    facturas = await response.json();

    renderizarFacturas();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'Error al consultar las facturas.',
      'error',
    );
  }
}

function renderizarFacturas(): void {
  facturasTableBody.innerHTML = '';

  if (facturas.length === 0) {
    facturasTableBody.innerHTML = `
      <tr>
        <td colspan="6">
          No hay facturas registradas.
        </td>
      </tr>
    `;

    return;
  }

  facturas.forEach((factura) => {
    const nombreCliente =
      factura.cliente?.nombreCliente ??
      `Cliente #${factura.clienteId}`;

    const cantidadDetalles =
      factura.detalles?.length ?? 0;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${factura.numero}</td>
      <td>${nombreCliente}</td>
      <td>${formatearFecha(factura.fecha)}</td>
      <td>${formatearMoneda(factura.total)}</td>
      <td>${cantidadDetalles}</td>
      <td>
        <button
          class="secondary-button"
          data-action="details"
          data-id="${factura.numero}"
        >
          Ver detalles
        </button>
      </td>
    `;

    facturasTableBody.appendChild(row);
  });
}

btnNuevaFactura.addEventListener('click', async () => {
  try {
    await Promise.all([
      cargarClientesParaFactura(),
      cargarProductosParaFactura(),
    ]);

    limpiarFormularioFactura();

    facturaFormContainer.classList.remove('hidden');
    facturaClienteSelect.focus();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'No fue posible preparar la factura.',
      'error',
    );
  }
});

btnCancelarFactura.addEventListener('click', () => {
  limpiarFormularioFactura();
  facturaFormContainer.classList.add('hidden');
});

async function cargarClientesParaFactura(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clientes`);

  if (!response.ok) {
    throw new Error('No fue posible cargar los clientes.');
  }

  clientes = await response.json();

  facturaClienteSelect.innerHTML =
    '<option value="">Selecciona un cliente</option>';

  clientes.forEach((cliente) => {
    const option = document.createElement('option');

    option.value = String(cliente.id);
    option.textContent = `${cliente.nombreCliente} - ${cliente.direccion}`;

    facturaClienteSelect.appendChild(option);
  });
}

async function cargarProductosParaFactura(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/productos`);

  if (!response.ok) {
    throw new Error('No fue posible cargar los productos.');
  }

  productos = await response.json();

  facturaProductoSelect.innerHTML =
    '<option value="">Selecciona un producto</option>';

  productos.forEach((producto) => {
    const option = document.createElement('option');

    option.value = String(producto.id);
    option.textContent =
      `${producto.nombreProducto} - ${formatearMoneda(producto.valor)}`;

    facturaProductoSelect.appendChild(option);
  });
}

btnAgregarProducto.addEventListener('click', () => {
  const productoId = Number(facturaProductoSelect.value);
  const cantidad = Number(facturaCantidadInput.value);

  if (!productoId) {
    mostrarMensaje(
      'Selecciona un producto.',
      'error',
    );

    return;
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarMensaje(
      'La cantidad debe ser mayor que cero.',
      'error',
    );

    return;
  }

  const producto = productos.find(
    (item) => item.id === productoId,
  );

  if (!producto) {
    mostrarMensaje(
      'El producto seleccionado no existe.',
      'error',
    );

    return;
  }

  const existente = detallesFactura.find(
    (item) => item.productoId === productoId,
  );

  if (existente) {
    existente.cantidad += cantidad;
    existente.subtotal =
      existente.cantidad * existente.valor;
  } else {
    detallesFactura.push({
      productoId: producto.id,
      nombreProducto: producto.nombreProducto,
      valor: producto.valor,
      cantidad,
      subtotal: producto.valor * cantidad,
    });
  }

  renderizarDetallesFactura();

  facturaProductoSelect.value = '';
  facturaCantidadInput.value = '1';
});

function renderizarDetallesFactura(): void {
  facturaDetallesBody.innerHTML = '';

  detallesFactura.forEach((detalle, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${detalle.nombreProducto}</td>
      <td>${formatearMoneda(detalle.valor)}</td>
      <td>${detalle.cantidad}</td>
      <td>${formatearMoneda(detalle.subtotal)}</td>
      <td>
        <button
          type="button"
          class="danger-button"
          data-index="${index}"
        >
          Eliminar
        </button>
      </td>
    `;

    facturaDetallesBody.appendChild(row);
  });

  const total = detallesFactura.reduce(
    (sum, detalle) => sum + detalle.subtotal,
    0,
  );

  facturaTotal.textContent = formatearMoneda(total);
}

facturaDetallesBody.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('button');

  if (!button) {
    return;
  }

  const index = Number(button.dataset.index);

  if (!Number.isInteger(index)) {
    return;
  }

  detallesFactura.splice(index, 1);

  renderizarDetallesFactura();
});

facturaForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const clienteId = Number(facturaClienteSelect.value);

  if (!clienteId) {
    mostrarMensaje(
      'Selecciona un cliente.',
      'error',
    );

    return;
  }

  if (detallesFactura.length === 0) {
    mostrarMensaje(
      'Agrega al menos un producto a la factura.',
      'error',
    );

    return;
  }

  try {
    // Primero creamos la cabeza de factura.
    const facturaResponse = await fetch(
      `${API_BASE_URL}/facturas`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId,
        }),
      },
    );

    if (!facturaResponse.ok) {
      throw new Error(
        'No fue posible crear la factura.',
      );
    }

    const factura: Factura =
      await facturaResponse.json();

    // Luego agregamos cada detalle.
    for (const detalle of detallesFactura) {
      const detalleResponse = await fetch(
        `${API_BASE_URL}/detalles-factura`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            numero: factura.numero,
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
          }),
        },
      );

      if (!detalleResponse.ok) {
        throw new Error(
          `No fue posible agregar el producto "${detalle.nombreProducto}" a la factura.`,
        );
      }
    }

    mostrarMensaje(
      `Factura #${factura.numero} creada correctamente.`,
      'success',
    );

    limpiarFormularioFactura();
    facturaFormContainer.classList.add('hidden');

    await cargarFacturas();
  } catch (error) {
    mostrarMensaje(
      error instanceof Error
        ? error.message
        : 'No fue posible crear la factura.',
      'error',
    );
  }
});

facturasTableBody.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('button');

  if (!button) {
    return;
  }

  const numero = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'details') {
    const factura = facturas.find(
      (item) => item.numero === numero,
    );

    if (!factura) {
      mostrarMensaje('No fue posible encontrar la factura.', 'error');
      return;
    }

    mostrarFacturaModal(factura);
  }
});


function limpiarFormularioFactura(): void {
  facturaForm.reset();

  detallesFactura = [];

  facturaDetallesBody.innerHTML = '';

  facturaTotal.textContent = formatearMoneda(0);

  facturaCantidadInput.value = '1';
}

// =========================
// Utilidades
// =========================

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(fecha));
}

// =========================
// Inicio
// =========================

void cargarClientes();