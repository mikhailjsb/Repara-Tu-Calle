-- Esquema de la base de datos para la aplicación Repara Tu Calle

CREATE TABLE IF NOT EXISTS reclamos (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    photo_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Añade aquí otras tablas en caso de ser necesario en el futuro