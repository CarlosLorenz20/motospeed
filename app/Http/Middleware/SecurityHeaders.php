<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Agrega cabeceras HTTP de seguridad en todas las respuestas.
 * Mitiga: XSS, clickjacking, MIME sniffing, información expuesta.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Evita que el navegador adivine el tipo MIME (MIME sniffing)
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Clickjacking: en producción solo mismo origen; en local se relaja para
        // que el checkout de Mercado Pago pueda pre-verificar las back_urls.
        if (app()->isProduction()) {
            $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        }

        // Control de referrer en cross-origin
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permisos de APIs del navegador (cámara, micrófono, geolocalización, etc.)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        // Forzar HTTPS en producción (HSTS — 1 año)
        if (app()->isProduction() || config('app.force_https', false)) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        // Dominios de Mercado Pago necesarios para el checkout
        $mpDomains = 'https://*.mercadopago.com https://*.mercadopago.cl https://*.mlstatic.com https://sdk.mercadopago.com';

        // Content Security Policy
        $cspDirectives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net {$mpDomains}",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' {$mpDomains}",
            "frame-src 'self' {$mpDomains}",
            "frame-ancestors 'self' {$mpDomains}",
            "object-src 'none'",
            "base-uri 'self'",
        ];

        // form-action solo en producción (en local causa conflictos de esquema HTTP/HTTPS)
        if (app()->isProduction()) {
            $appHost = parse_url(config('app.url', ''), PHP_URL_SCHEME)
                     . '://'
                     . parse_url(config('app.url', ''), PHP_URL_HOST);
            $cspDirectives[] = "form-action 'self' {$appHost}";
        }

        $response->headers->set('Content-Security-Policy', implode('; ', $cspDirectives));

        // Eliminar información del servidor (seguridad por oscuridad, capa extra)
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}
