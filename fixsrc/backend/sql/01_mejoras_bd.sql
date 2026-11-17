

BEGIN;

-- 1. Agregar columna activo en productos (idempotente)
ALTER TABLE productos
    ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

-- 2. Normalizar datos existentes en productos
UPDATE productos
SET activo = true
WHERE activo IS NULL;

UPDATE productos
SET category = lower(btrim(category))
WHERE category IS NOT NULL
  AND category <> lower(btrim(category));

UPDATE productos
SET badge = NULLIF(lower(btrim(badge)), '')
WHERE badge IS DISTINCT FROM NULLIF(lower(btrim(badge)), '');

UPDATE productos
SET rating  = COALESCE(rating, 0),
    reviews = COALESCE(reviews, 0),
    stock   = COALESCE(stock, 0)
WHERE rating IS NULL
   OR reviews IS NULL
   OR stock IS NULL;

-- 3. Normalizar datos existentes en usuarios
UPDATE usuarios
SET email = lower(btrim(email))
WHERE email IS NOT NULL
  AND email <> lower(btrim(email));

UPDATE usuarios
SET rol = COALESCE(NULLIF(upper(btrim(rol)), ''), 'USER')
WHERE rol IS DISTINCT FROM COALESCE(NULLIF(upper(btrim(rol)), ''), 'USER');

UPDATE usuarios
SET fecha_creacion = COALESCE(fecha_creacion, CURRENT_TIMESTAMP)
WHERE fecha_creacion IS NULL;

-- 4. Aplicar NOT NULL, DEFAULT y longitudes alineadas con las entidades JPA
ALTER TABLE productos
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN universe SET NOT NULL,
    ALTER COLUMN category SET NOT NULL,
    ALTER COLUMN price SET NOT NULL,
    ALTER COLUMN stock SET DEFAULT 0,
    ALTER COLUMN stock SET NOT NULL,
    ALTER COLUMN rating SET DEFAULT 0,
    ALTER COLUMN rating SET NOT NULL,
    ALTER COLUMN reviews SET DEFAULT 0,
    ALTER COLUMN reviews SET NOT NULL,
    ALTER COLUMN image TYPE varchar(500),
    ALTER COLUMN description TYPE varchar(1000),
    ALTER COLUMN activo SET DEFAULT true,
    ALTER COLUMN activo SET NOT NULL;

ALTER TABLE usuarios
    ALTER COLUMN nombre SET NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN password_hash SET NOT NULL,
    ALTER COLUMN rol SET DEFAULT 'USER',
    ALTER COLUMN rol SET NOT NULL,
    ALTER COLUMN fecha_creacion SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN fecha_creacion SET NOT NULL;

-- 5. Restricciones CHECK ... NOT VALID (idempotentes mediante pg_constraint)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_productos_price'
          AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT chk_productos_price
            CHECK (price >= 0) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_productos_old_price'
          AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT chk_productos_old_price
            CHECK (old_price IS NULL OR old_price >= price) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_productos_stock'
          AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT chk_productos_stock
            CHECK (stock >= 0) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_productos_rating'
          AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT chk_productos_rating
            CHECK (rating >= 0 AND rating <= 5) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_productos_category'
          AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT chk_productos_category
            CHECK (category IN ('anime', 'gaming', 'superheroes', 'sci-fi')) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_productos_badge'
          AND conrelid = 'productos'::regclass
    ) THEN
        ALTER TABLE productos
            ADD CONSTRAINT chk_productos_badge
            CHECK (badge IS NULL OR badge IN ('sale', 'new', 'preorder')) NOT VALID;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_usuarios_rol'
          AND conrelid = 'usuarios'::regclass
    ) THEN
        ALTER TABLE usuarios
            ADD CONSTRAINT chk_usuarios_rol
            CHECK (rol IN ('USER', 'ADMIN')) NOT VALID;
    END IF;
END $$;

-- 6. Índices (sin comandos de Row Level Security)
CREATE UNIQUE INDEX IF NOT EXISTS ux_usuarios_email_lower
    ON usuarios (lower(email));

CREATE INDEX IF NOT EXISTS ix_productos_category
    ON productos (category);

CREATE INDEX IF NOT EXISTS ix_productos_activo
    ON productos (activo);

COMMIT;
