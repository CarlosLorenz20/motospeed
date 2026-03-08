# Motos y Repuestos Speed - E-commerce

Tienda online para venta de motos y repuestos en Chile.

## Stack Tecnológico

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Blade + Tailwind CSS + Alpine.js
- **Base de datos**: PostgreSQL (Supabase)
- **Pagos**: Mercado Pago Chile

## Instalación Local

```bash
composer install
cp .env.example .env
php artisan key:generate
# Configurar .env
php artisan serve
```

## Deploy en Hostinger

1. Subir archivos a `public_html/`
2. Crear `.env` con credenciales de producción
3. Ejecutar via SSH:
```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
chmod -R 775 storage bootstrap/cache
```

## Credenciales de Prueba

**Admin:** admin@motosyrepuestosspeed.cl / admin123

**Tarjeta MP Sandbox:** 4509 9535 6623 3704 | 11/30 | 123 | APRO
