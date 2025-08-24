# Repara Tu Calle

Esta aplicación web permite a los ciudadanos reportar problemas en las calles (hoyos, desniveles, resaltos fuera de norma y problemas en calles peatonales), subiendo una descripción y una foto del incidente. La aplicación está compuesta por un _backend_ en Node.js con Express y PostgreSQL, y un _frontend_ en React.

## Requisitos previos

* Node.js (versión 18 o superior) y npm instalados en tu sistema.
* PostgreSQL en funcionamiento. Debes crear una base de datos y un usuario con permisos de lectura y escritura.

## Estructura del proyecto

```
repara-tu-calle/
├── backend/           # Código del servidor Node/Express
│   ├── server.js      # Servidor Express
│   ├── package.json   # Dependencias y scripts
│   ├── .env.example   # Variables de entorno de ejemplo
│   └── schema.sql     # Esquema de la base de datos
├── frontend/          # Código de la aplicación React
│   ├── public/
│   │   └── index.html # HTML base
│   ├── src/
│   │   ├── components/  # Componentes React (formulario, resultados, info, navbar)
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md         # Este archivo
```

## Configuración de la base de datos

1. Crea una base de datos llamada `repara_tu_calle` (o el nombre que prefieras) y un usuario con permisos. Por ejemplo:

   ```sql
   CREATE DATABASE repara_tu_calle;
   CREATE USER reparador_contraseña WITH PASSWORD 'tu_contraseña';
   GRANT ALL PRIVILEGES ON DATABASE repara_tu_calle TO reparador_contraseña;
   ```

2. Importa el esquema de la base de datos ejecutando el archivo `schema.sql` que se encuentra en el directorio `backend`:

   ```bash
   psql -U <tu_usuario> -d repara_tu_calle -f backend/schema.sql
   ```

3. Crea un archivo `.env` en el directorio `backend` a partir de `.env.example` y ajusta la cadena de conexión `DATABASE_URL` con tus credenciales y host de PostgreSQL. Por ejemplo:

   ```env
   PORT=3001
   DATABASE_URL=postgres://reparador_contraseña:tu_contraseña@localhost:5432/repara_tu_calle
   ```

## Instalación y ejecución

1. **Instalar dependencias del backend**

   Abre una terminal en el directorio `backend` y ejecuta:

   ```bash
   npm install
   ```

2. **Arrancar el servidor backend**

   En la misma carpeta (`backend`), ejecuta:

   ```bash
   npm start
   ```

   El servidor se iniciará en el puerto indicado en el `.env` (`3001` por defecto) y expondrá las rutas:

   * `POST /api/reclamos` – Crear un nuevo reclamo (campos: `category`, `description`, `photo`).
   * `GET  /api/reclamos` – Obtener todos los reclamos y el recuento por categoría.
   * `GET  /api/info`     – Obtener información sobre la iniciativa.

3. **Instalar dependencias del frontend**

   En otra terminal, ve al directorio `frontend` y ejecuta:

   ```bash
   npm install
   ```

4. **Arrancar la aplicación frontend**

   En el directorio `frontend`, ejecuta:

   ```bash
   npm start
   ```

   Esto iniciará la aplicación React en `http://localhost:3000`. Gracias a la propiedad `proxy` en el `package.json` del frontend, las llamadas a la API se redirigirán automáticamente al backend en el puerto `3001`.

## Uso de la aplicación

1. Abre tu navegador en `http://localhost:3000`.
2. La barra de navegación ofrece tres secciones:
   * **Nuevo reclamo**: formulario para seleccionar una categoría, escribir una descripción y subir una foto del problema.
   * **Resultados**: muestra todos los reclamos realizados hasta el momento y un recuento de cuántos hay por categoría.
   * **Información**: proporciona una descripción de la iniciativa.
3. Completa el formulario y envía para crear un reclamo. El mensaje de confirmación te indicará si fue exitoso.

## Diseño y tecnologías

* **Frontend:** React con React Router para la navegación. El estilo es moderno y minimalista utilizando CSS, con colores suaves y tarjetas para los reclamos.
* **Backend:** Node.js con Express para la API. Se emplea `multer` para la subida de imágenes y `pg` para interactuar con PostgreSQL.
* **Base de datos:** PostgreSQL almacena los reclamos en una tabla `reclamos` (ver `schema.sql` para el esquema).

## Notas finales

* Asegúrate de que la carpeta `backend/uploads` tenga permisos de escritura para guardar las fotos subidas.
* Las imágenes se sirven desde el backend a través de la ruta `/uploads`, por lo que los registros devuelven la propiedad `photo_path` con la URL relativa al servidor.
* Puedes personalizar los textos y estilos modificando los archivos React y CSS correspondientes.