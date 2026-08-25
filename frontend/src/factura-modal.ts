import type { Factura } from './types';

function formatearMoneda(valor: number): string {
  return `$ ${valor.toLocaleString('es-CO')}`;
}

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function mostrarFacturaModal(factura: Factura): void {
  cerrarFacturaModal();

  const detalles = factura.detalles ?? [];

  const modal = document.createElement('div');
  modal.className = 'invoice-modal-overlay';
  modal.id = 'invoice-modal';

  modal.innerHTML = `
    <div class="invoice-modal">

      <div class="invoice-modal-header">
        <div>
          <span class="invoice-modal-label">Factura</span>
          <h2>#${factura.numero}</h2>
        </div>

        <button
          type="button"
          class="invoice-modal-close"
          id="btnCerrarFacturaModal"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div class="invoice-modal-info">

        <div>
          <span>Cliente</span>
          <strong>
            ${factura.cliente?.nombreCliente ?? 'Cliente no disponible'}
          </strong>
        </div>

        <div>
          <span>Dirección</span>
          <strong>
            ${factura.cliente?.direccion ?? 'Dirección no disponible'}
          </strong>
        </div>

        <div>
          <span>Fecha</span>
          <strong>
            ${formatearFecha(factura.fecha)}
          </strong>
        </div>

      </div>

      <div class="invoice-modal-table-wrapper">
        <table class="invoice-modal-table">

          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>

            ${
              detalles.length === 0
                ? `
                  <tr>
                    <td colspan="4" class="invoice-empty">
                      Esta factura no tiene detalles.
                    </td>
                  </tr>
                `
                : detalles
                    .map((detalle) => {
                      const precio = detalle.producto?.valor ?? 0;
                      const nombre =
                        detalle.producto?.nombreProducto ??
                        'Producto no disponible';

                      const subtotal = precio * detalle.cantidad;

                      return `
                        <tr>
                          <td>${nombre}</td>

                          <td>
                            ${formatearMoneda(precio)}
                          </td>

                          <td>
                            ${detalle.cantidad}
                          </td>

                          <td>
                            ${formatearMoneda(subtotal)}
                          </td>
                        </tr>
                      `;
                    })
                    .join('')
            }

          </tbody>

        </table>
      </div>

      <div class="invoice-modal-footer">
        <span>Total</span>
        <strong>
          ${formatearMoneda(factura.total)}
        </strong>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document
    .querySelector('#btnCerrarFacturaModal')
    ?.addEventListener('click', cerrarFacturaModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      cerrarFacturaModal();
    }
  });

  document.addEventListener('keydown', manejarEscape);
}

export function cerrarFacturaModal(): void {
  document.querySelector('#invoice-modal')?.remove();
  document.removeEventListener('keydown', manejarEscape);
}

function manejarEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    cerrarFacturaModal();
  }
}