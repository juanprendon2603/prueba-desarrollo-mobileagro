# Prueba de desarrollo — Mobileagro

## Tecnologías

* TypeScript
* Node.js
* NestJS
* Prisma ORM
* SQLite
* HTML, CSS y TypeScript
* Netlify para el frontend
* Render para el backend

## Ejercicio 1

Ejercicio desarrollado en TypeScript utilizando Node.js y `readline-sync`.

Para ejecutarlo localmente:

```bash
cd ejercicio-1
npm install
npm run build
```

Luego se puede ejecutar según las instrucciones del ejercicio.

**Demo:**
https://prueba-desarrollo-mobileagro-1.netlify.app/

## Ejercicio 2

Aplicación de gestión comercial con:

* Gestión de clientes.
* Gestión de productos.
* Creación y consulta de facturas.
* Detalle de productos por factura.
* Edición y eliminación de registros.
* Persistencia de datos mediante Prisma y SQLite.

### Ejecución local

Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npx tsc
npx http-server .
```

El frontend utiliza el backend local cuando se ejecuta en `localhost` y el backend desplegado cuando se accede desde la versión publicada.

**Demo:**
https://prueba-desarrollo-mobileagro.netlify.app/

**Backend:**
https://prueba-desarrollo-mobileagro.onrender.com
