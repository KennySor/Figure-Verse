# 🌌 FigureVerse

> **Plataforma E-commerce de Comercio Electrónico Especializada en la Venta de Figuras de Acción y Anime.**

![Angular](https://img.shields.io/badge/Angular-v20-DD0031?style=for-the-badge&logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-v3.2-6DB33F?style=for-the-badge&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-336791?style=for-the-badge&logo=postgresql)
![Render](https://img.shields.io/badge/Render-Hosted-black?style=for-the-badge&logo=render)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📌 Descripción del Proyecto

**FigureVerse** es una tienda en línea moderna diseñada para la comercialización de figuras coleccionables de anime, cine y cómics (S.H.Figuarts, Nendoroid, Scale Figures, etc.). 

El sistema ofrece una experiencia de compra fluida tanto para clientes como para administradores de la tienda:
* **Catálogo e-commerce:** Búsqueda rápida por categorías, marcas, escalas y materiales.
* **Carrito de Compras y Checkout:** Gestión dinámica de productos, cálculo de totales e integración con pasarela de pago simulada.
* **Panel de Administración (CRUD):** Control de inventario, stock, órdenes de compra y precios en tiempo real.
* **Detalle Técnico de Productos:** Fichas con dimensiones exactas, articulaciones, fabricante y fotografías en alta calidad.

---

## 🚀 Arquitectura y Stack Tecnológico

El proyecto utiliza una arquitectura desacoplada (Frontend & Backend independientes) desplegada en **servicios en la nube 100% gratuitos (Free Tier)**:

### 💻 Frontend
* **Framework:** Angular 20 (Componentes Standalone & Signals)
* **Estilos:** Tailwind CSS + Angular Material
* **Gestión de Estado:** RxJS
* **Hosting:** Vercel / Netlify (Free Tier)

### ⚙️ Backend
* **Lenguaje & Framework:** Java 17 / Spring Boot 3.2
* **Seguridad:** Spring Security + JWT (JSON Web Tokens)
* **Persistencia:** Spring Data JPA / Hibernate
* **Hosting:** Render.com (Web Service Free Tier)

### 🗄️ Base de Datos y Servicios Externos
* **Motor BD:** PostgreSQL 15
* **DB Cloud Hosting:** Supabase (Instancia gestionada)
* **Almacenamiento de Imágenes:** Cloudinary (Imágenes del catálogo de figuras)
* **Notificaciones por Correo:** Resend / SendGrid (Confirmación de compra vía SMTP)

---

## ✨ Características de la Tienda

1. **Catálogo de Ventas:** Filtrado por franquicia (*Dragon Ball, Naruto, Marvel*), escala (*7.5" / 19cm*), fabricante (*Bandai, Good Smile*) y material (*ABS, PVC*).
2. **Carrito de Compras:** Persistencia de productos seleccionados, ajuste de cantidad y resumen de orden.
3. **Gestión de Usuarios y Roles:** Autenticación con JWT diferenciando usuarios compradores (`ROLE_USER`) y administradores de la tienda (`ROLE_ADMIN`).
4. **Panel de Inventario:** Permite a los administradores agregar nuevos lanzamientos, modificar stock y actualizar precios.

---

## 🛠️ Instalación y Configuración Local

### Requisitos Previos
* Java JDK 17+
* Node.js v18+ y Angular CLI (`npm install -g @angular/cli`)
* PostgreSQL (Local o en Supabase)
* Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/KennySor/Figure-Verse.git
cd Figure-Verse
```

### 2. Frontend (Angular)
```bash
cd fixsrc/frontend
npm install
npm start
```
Abre `http://localhost:4200`.

### 3. Backend (Spring Boot)
Configura PostgreSQL en `fixsrc/backend/src/main/resources/application.properties` y ejecuta:
```bash
cd fixsrc/backend
mvn spring-boot:run
```