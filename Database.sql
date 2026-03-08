-- ============================================================
--  Motos y Repuestos Speed — Esquema MySQL
--  Compatible con phpMyAdmin / Hostinger (MySQL 8.x)
--  Motor: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

-- ─────────────────────────────────────────────────────────────
--  1. USERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
    `id`                BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `name`              VARCHAR(255)        NOT NULL,
    `email`             VARCHAR(255)        NOT NULL,
    `email_verified_at` TIMESTAMP           NULL DEFAULT NULL,
    `password`          VARCHAR(255)        NOT NULL,
    `role`              ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
    `telefono`          VARCHAR(255)        NULL DEFAULT NULL,
    `avatar`            VARCHAR(255)        NULL DEFAULT NULL,
    `remember_token`    VARCHAR(100)        NULL DEFAULT NULL,
    `created_at`        TIMESTAMP           NULL DEFAULT NULL,
    `updated_at`        TIMESTAMP           NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  2. PASSWORD RESET TOKENS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `email`      VARCHAR(255)    NOT NULL,
    `token`      VARCHAR(255)    NOT NULL,
    `created_at` TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  3. SESSIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sessions` (
    `id`            VARCHAR(255)    NOT NULL,
    `user_id`       BIGINT UNSIGNED NULL DEFAULT NULL,
    `ip_address`    VARCHAR(45)     NULL DEFAULT NULL,
    `user_agent`    TEXT            NULL DEFAULT NULL,
    `payload`       LONGTEXT        NOT NULL,
    `last_activity` INT             NOT NULL,
    PRIMARY KEY (`id`),
    KEY `sessions_user_id_index` (`user_id`),
    KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  4. CACHE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cache` (
    `key`        VARCHAR(255)    NOT NULL,
    `value`      MEDIUMTEXT      NOT NULL,
    `expiration` INT             NOT NULL,
    PRIMARY KEY (`key`),
    KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cache_locks` (
    `key`        VARCHAR(255)    NOT NULL,
    `owner`      VARCHAR(255)    NOT NULL,
    `expiration` INT             NOT NULL,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  5. QUEUE JOBS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `jobs` (
    `id`           BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `queue`        VARCHAR(255)        NOT NULL,
    `payload`      LONGTEXT            NOT NULL,
    `attempts`     TINYINT UNSIGNED    NOT NULL,
    `reserved_at`  INT UNSIGNED        NULL DEFAULT NULL,
    `available_at` INT UNSIGNED        NOT NULL,
    `created_at`   INT UNSIGNED        NOT NULL,
    PRIMARY KEY (`id`),
    KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_batches` (
    `id`             VARCHAR(255)    NOT NULL,
    `name`           VARCHAR(255)    NOT NULL,
    `total_jobs`     INT             NOT NULL,
    `pending_jobs`   INT             NOT NULL,
    `failed_jobs`    INT             NOT NULL,
    `failed_job_ids` LONGTEXT        NOT NULL,
    `options`        MEDIUMTEXT      NULL DEFAULT NULL,
    `cancelled_at`   INT             NULL DEFAULT NULL,
    `created_at`     INT             NOT NULL,
    `finished_at`    INT             NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `failed_jobs` (
    `id`         BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `uuid`       VARCHAR(255)        NOT NULL,
    `connection` TEXT                NOT NULL,
    `queue`      TEXT                NOT NULL,
    `payload`    LONGTEXT            NOT NULL,
    `exception`  LONGTEXT            NOT NULL,
    `failed_at`  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  6. CATEGORIES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `categories` (
    `id`          BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `nombre`      VARCHAR(255)        NOT NULL,
    `slug`        VARCHAR(255)        NOT NULL,
    `descripcion` TEXT                NULL DEFAULT NULL,
    `icono`       VARCHAR(255)        NULL DEFAULT NULL,
    `activa`      TINYINT(1)          NOT NULL DEFAULT 1,
    `created_at`  TIMESTAMP           NULL DEFAULT NULL,
    `updated_at`  TIMESTAMP           NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  7. PRODUCTS
--  Adaptado para Mercado Pago Chile (MLC):
--    precio/precio_oferta → INT (CLP no usa decimales, MP exige entero)
--    sku         → se envía como item.id a la preferencia MP
--    nombre      → item.title en MP (máx 255)
--    descripcion → item.description en MP (se trunca a 255 en controller)
--    imagen      → item.picture_url en MP
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `products` (
    `id`                   BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `category_id`          BIGINT UNSIGNED     NOT NULL,

    -- Datos para Mercado Pago
    `nombre`               VARCHAR(255)        NOT NULL,   -- → item.title
    `slug`                 VARCHAR(255)        NOT NULL,
    `descripcion`          TEXT                NOT NULL,   -- → item.description
    `sku`                  VARCHAR(255)        NULL DEFAULT NULL, -- → item.id

    -- Precios CLP (enteros sin decimales — obligatorio para MP Chile)
    `precio`               INT UNSIGNED        NOT NULL,          -- precio normal → unit_price
    `precio_oferta`        INT UNSIGNED        NULL DEFAULT NULL, -- precio con descuento → unit_price

    -- Inventario (se valida antes de enviar a MP)
    `stock`                INT                 NOT NULL DEFAULT 0,

    -- Imágenes
    `imagen`               VARCHAR(255)        NULL DEFAULT NULL,  -- → item.picture_url
    `imagenes_adicionales` JSON                NULL DEFAULT NULL,

    -- Info técnica motos/repuestos
    `marca`                VARCHAR(255)        NULL DEFAULT NULL,
    `modelo_compatible`    VARCHAR(255)        NULL DEFAULT NULL,  -- ej: Honda CBR 150 2020

    -- Estado
    `destacado`            TINYINT(1)          NOT NULL DEFAULT 0,
    `activo`               TINYINT(1)          NOT NULL DEFAULT 1,

    `created_at`           TIMESTAMP           NULL DEFAULT NULL,
    `updated_at`           TIMESTAMP           NULL DEFAULT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `products_slug_unique` (`slug`),
    UNIQUE KEY `products_sku_unique` (`sku`),
    KEY `products_category_id_foreign` (`category_id`),
    KEY `products_activo_index` (`activo`),
    KEY `products_destacado_index` (`destacado`),
    KEY `products_stock_index` (`stock`),
    CONSTRAINT `products_category_id_foreign`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  8. ORDERS
--  Estados exactos de Mercado Pago:
--    pending    → preferencia creada, esperando pago
--    approved   → pago aprobado (collection_status=approved)
--    in_process → en revisión antifraude MP
--    rejected   → rechazado por MP o banco
--    cancelled  → cancelado antes de completar
--    refunded   → devuelto
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `orders` (
    `id`                   BIGINT UNSIGNED     NOT NULL AUTO_INCREMENT,

    -- Relaciones
    `user_id`              BIGINT UNSIGNED     NULL DEFAULT NULL,
    `product_id`           BIGINT UNSIGNED     NULL DEFAULT NULL,
    `quantity`             INT UNSIGNED        NOT NULL DEFAULT 1,

    -- IDs de Mercado Pago
    `mp_preference_id`     VARCHAR(255)        NULL DEFAULT NULL, -- 3248514938-xxxx-xxxx
    `mp_payment_id`        VARCHAR(255)        NULL DEFAULT NULL, -- collection_id del back_url
    `mp_merchant_order_id` VARCHAR(255)        NULL DEFAULT NULL,
    `mp_payment_type`      VARCHAR(50)         NULL DEFAULT NULL, -- credit_card / account_money / etc.

    -- Estado (valores exactos que devuelve MP)
    `status`               ENUM('pending','approved','in_process','rejected','cancelled','refunded')
                                               NOT NULL DEFAULT 'pending',

    -- Monto CLP (entero sin decimales)
    `amount`               BIGINT UNSIGNED     NOT NULL,
    `currency`             CHAR(3)             NOT NULL DEFAULT 'CLP',

    -- Snapshot del comprador al momento del pago
    `buyer_name`           VARCHAR(255)        NULL DEFAULT NULL,
    `buyer_email`          VARCHAR(255)        NULL DEFAULT NULL,
    `buyer_phone`          VARCHAR(50)         NULL DEFAULT NULL,

    -- Metadata extra (dirección de envío, notas, etc.)
    `metadata`             JSON                NULL DEFAULT NULL,

    `created_at`           TIMESTAMP           NULL DEFAULT NULL,
    `updated_at`           TIMESTAMP           NULL DEFAULT NULL,

    PRIMARY KEY (`id`),
    KEY `orders_user_id_foreign` (`user_id`),
    KEY `orders_product_id_foreign` (`product_id`),
    KEY `orders_mp_preference_id_index` (`mp_preference_id`),
    KEY `orders_mp_payment_id_index` (`mp_payment_id`),
    KEY `orders_status_index` (`status`),
    KEY `orders_created_at_index` (`created_at`),
    CONSTRAINT `orders_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `orders_product_id_foreign`
        FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
