# Prueba de Desarrollo

Solución de la prueba de desarrollo, dividida en dos ejercicios independientes.

## Tecnologías

* TypeScript
* NestJS
* Prisma
* SQLite
* HTML
* CSS
* API REST

---

## Ejercicio 1 — Cálculo de salario

Aplicación desarrollada en TypeScript para realizar el cálculo del salario semanal de un empleado, teniendo en cuenta las horas trabajadas y las horas extras según las condiciones establecidas en el ejercicio.

### Ejecución

```bash
cd ejercicio-1
npm install
npm run dev
```

---

## Ejercicio 2 — Gestión comercial

Aplicación web para la gestión de:

* Clientes.
* Productos.
* Facturas.
* Detalles de factura.

Permite crear, consultar, editar y eliminar clientes y productos, además de crear y consultar facturas con sus respectivos detalles.

### Backend

Desarrollado con NestJS, utilizando Prisma como ORM y SQLite como base de datos.

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Backend:

```text
http://localhost:3000
```

### Frontend

Desarrollado con HTML, CSS y TypeScript.

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:8080
```

### Base de datos

Para consultar la base de datos mediante Prisma Studio:

```bash
cd backend
npx prisma studio
```
