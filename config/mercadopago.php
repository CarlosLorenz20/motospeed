<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Mercado Pago
    |--------------------------------------------------------------------------
    | Credenciales que provee el cliente desde su cuenta de MP.
    | Producción: https://www.mercadopago.cl/developers/es/docs
    |
    | NUNCA hardcodear estas claves aquí. Siempre desde .env.
    */

    'public_key'     => env('MP_PUBLIC_KEY'),
    'access_token'   => env('MP_ACCESS_TOKEN'),
    'webhook_secret' => env('MP_WEBHOOK_SECRET'),   // para verificar notificaciones IPN

    /*
    |--------------------------------------------------------------------------
    | URLs de retorno
    |--------------------------------------------------------------------------
    */
    'success_url'  => env('MP_SUCCESS_URL',  '/checkout/exito'),
    'failure_url'  => env('MP_FAILURE_URL',  '/checkout/error'),
    'pending_url'  => env('MP_PENDING_URL',  '/checkout/pendiente'),
    'webhook_url'  => env('MP_WEBHOOK_URL',  '/checkout/webhook'),

    /*
    |--------------------------------------------------------------------------
    | Entorno
    |--------------------------------------------------------------------------
    | 'sandbox'    → modo pruebas (credenciales de test de MP)
    | 'production' → modo real
    */
    'mode' => env('MP_MODE', 'sandbox'),

    // Email del comprador test (solo se usa en sandbox)
    'test_buyer_email' => env('MP_TEST_BUYER_EMAIL', ''),

];
