# Figureverse — Angular + Spring Boot (versión corregida)

## Frontend
```bash
cd frontend
npm install
npm start
```

Abre la URL que indique Angular (normalmente `http://localhost:4200`).

## Backend
Configura PostgreSQL en `backend/src/main/resources/application.properties` y ejecuta:

```bash
cd backend
mvn spring-boot:run
```

## Correcciones visuales aplicadas
- Se restauraron los estilos originales como CSS global en `frontend/src/styles.css`.
- Se corrigieron las rutas de imágenes y video para Angular (`assets/...`).
- Se restauraron las fuentes Google Fonts y metadatos del HTML original.
- Se migró el JavaScript original a `frontend/src/assets/figureverse.js` y se carga después del render de Angular.
- Se verificó que el frontend compile correctamente con Angular.

Las imágenes y videos están en `frontend/src/assets/`.
