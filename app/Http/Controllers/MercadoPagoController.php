<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;
use MercadoPago\MercadoPagoConfig;

class MercadoPagoController extends Controller
{
    // ─── Configuración ───────────────────────────────────────────────────────

    private function configureSDK(): void
    {
        MercadoPagoConfig::setAccessToken(config('mercadopago.access_token'));
    }

    // ─── Crear preferencia de pago ───────────────────────────────────────────

    /**
     * Recibe: product_id, quantity (opcional)
     * Devuelve: redirect al checkout de Mercado Pago
     */
    public function createPreference(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'integer|min:1|max:99',
        ]);

        $product  = Product::findOrFail($validated['product_id']);
        $quantity = $validated['quantity'] ?? 1;
        $amount   = (int) ($product->precio * $quantity); // CLP sin decimales

        // Crear orden local (estado inicial: pending)
        $order = Order::create([
            'user_id'      => auth()->id(),
            'product_id'   => $product->id,
            'quantity'     => $quantity,
            'amount'       => $amount,
            'currency'     => 'CLP',
            'buyer_name'   => auth()->user()?->name,
            'buyer_email'  => auth()->user()?->email,
            'buyer_phone'  => auth()->user()?->telefono,
            'status'       => 'pending',
        ]);

        // Si no hay credenciales MP configuradas → mostrar error amigable
        if (! config('mercadopago.access_token')) {
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['error' => 'El sistema de pagos aún no está configurado.'], 500);
            }
            return redirect()->back()->with(
                'error',
                'El sistema de pagos aún no está configurado. Por favor contáctenos.'
            );
        }

        try {
            $this->configureSDK();

            $client = new PreferenceClient();

            // Detectar si es localhost
            $appUrl = config('app.url');
            $isLocalhost = str_contains($appUrl, 'localhost') || str_contains($appUrl, '.test');

            // Configuración MÍNIMA igual que Node.js
            $preferenceData = [
                'items' => [
                    [
                        'id'          => (string) $product->id,
                        'title'       => $product->nombre,
                        'quantity'    => (int) $quantity,
                        'unit_price'  => (int) $product->precio,
                        'currency_id' => 'CLP',
                    ],
                ],
                'back_urls' => [
                    'success' => route('checkout.exito',     ['order' => $order->id]),
                    'failure' => route('checkout.error',     ['order' => $order->id]),
                    'pending' => route('checkout.pendiente', ['order' => $order->id]),
                ],
                'external_reference'   => (string) $order->id,
                'statement_descriptor' => 'MOTOSPEED',
            ];

            // Solo agregar notification_url y auto_return si NO es localhost
            if (! $isLocalhost) {
                $preferenceData['notification_url'] = route('checkout.webhook');
                $preferenceData['auto_return'] = 'approved';
            }

            // Payer: solo si hay usuario autenticado (igual que Node.js)
            if (auth()->check()) {
                $user = auth()->user();
                $preferenceData['payer'] = [
                    'name'  => $user->name ?? '',
                    'email' => $user->email ?? '',
                ];
            }

            // Log para debug
            Log::info('MercadoPago preferenceData', ['data' => $preferenceData]);

            $preference = $client->create($preferenceData);

            Log::info('MercadoPago preference creada OK', ['preference_id' => $preference->id]);

            // Guardar el preference_id en la orden
            $order->update(['mp_preference_id' => $preference->id]);

            // Usar sandbox_init_point si existe, sino init_point
            $url = $preference->sandbox_init_point ?? $preference->init_point;

            // Si es petición AJAX, devolver JSON con la URL
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'redirect_url' => $url,
                    'order_id'     => $order->id,
                    'preference_id' => $preference->id,
                ]);
            }

            return redirect()->away($url);

        } catch (MPApiException $e) {
            $apiResponse = $e->getApiResponse();
            $content = $apiResponse ? $apiResponse->getContent() : null;
            
            Log::error('MercadoPago MPApiException DETALLADO', [
                'order_id'     => $order->id,
                'message'      => $e->getMessage(),
                'status_code'  => $apiResponse ? $apiResponse->getStatusCode() : null,
                'content_raw'  => $content,
                'content_json' => is_string($content) ? json_decode($content, true) : $content,
            ]);
            $order->update(['status' => 'cancelled']);

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['error' => 'Ocurrió un problema al iniciar el pago.'], 500);
            }

            return redirect()->route('checkout.error', ['order' => $order->id])
                ->with('error', 'Ocurrió un problema al iniciar el pago. Intenta nuevamente.');

        } catch (\Throwable $e) {
            Log::error('MercadoPago error inesperado', [
                'order_id' => $order->id,
                'message'  => $e->getMessage(),
            ]);
            $order->update(['status' => 'cancelled']);

            if ($request->ajax() || $request->wantsJson()) {
                return response()->json(['error' => 'Error interno.'], 500);
            }

            return redirect()->route('checkout.error', ['order' => $order->id])
                ->with('error', 'Error interno. Por favor intenta más tarde.');
        }
    }

    // ─── Retorno: pago aprobado ───────────────────────────────────────────────

    public function success(Request $request, Order $order)
    {
        // MP envía: collection_id, collection_status, payment_id, payment_type, merchant_order_id
        if ($request->collection_status === 'approved') {
            $order->update([
                'status'                => 'approved',
                'mp_payment_id'         => $request->collection_id,
                'mp_merchant_order_id'  => $request->merchant_order_id,
                'mp_payment_type'       => $request->payment_type,
            ]);
        }

        $this->sendOrderEmail($order);

        return view('checkout.exito', compact('order'));
    }

    // ─── Retorno: pago rechazado ──────────────────────────────────────────────

    public function failure(Request $request, Order $order)
    {
        $order->update(['status' => 'rejected']);

        $this->sendOrderEmail($order);

        return view('checkout.error', compact('order'));
    }

    // ─── Retorno: pago pendiente ──────────────────────────────────────────────

    public function pending(Request $request, Order $order)
    {
        $order->update(['status' => 'in_process']);

        $this->sendOrderEmail($order);

        return view('checkout.pendiente', compact('order'));
    }

    // ─── Helper: notificación por email ──────────────────────────────────────

    private function sendOrderEmail(Order $order): void
    {
        if (! $order->buyer_email) return;
        try {
            Mail::to($order->buyer_email)->send(new \App\Mail\OrderStatusMail($order));
        } catch (\Throwable $e) {
            Log::warning('OrderStatusMail no enviado', ['order' => $order->id, 'error' => $e->getMessage()]);
        }
    }

    // ─── Webhook IPN ─────────────────────────────────────────────────────────

    /**
     * Mercado Pago notifica cambios de estado vía POST.
     * Se debe verificar la firma del webhook antes de procesar.
     */
    public function webhook(Request $request)
    {
        // Verificar firma del webhook si MP_WEBHOOK_SECRET está configurado
        $secret = config('mercadopago.webhook_secret');
        if ($secret) {
            $xSignature  = $request->header('x-signature', '');
            $xRequestId  = $request->header('x-request-id', '');
            $queryParams = $request->query();

            // Construir el mensaje a verificar
            $dataId   = $queryParams['data.id'] ?? $queryParams['data_id'] ?? '';
            $manifest = "id:{$dataId};request-id:{$xRequestId};ts:" . explode(',', $xSignature)[1] ?? '';

            $parts = [];
            foreach (explode(',', $xSignature) as $part) {
                [$k, $v] = explode('=', $part, 2) + ['', ''];
                $parts[$k] = $v;
            }

            $ts      = $parts['ts'] ?? '';
            $v1Hash  = $parts['v1'] ?? '';
            $message = "id:{$dataId};request-id:{$xRequestId};ts:{$ts}";
            $hmac    = hash_hmac('sha256', $message, $secret);

            if (! hash_equals($hmac, $v1Hash)) {
                Log::warning('MercadoPago webhook: firma inválida', ['ip' => $request->ip()]);
                return response()->json(['error' => 'Invalid signature'], 400);
            }
        }

        $topic = $request->input('type', $request->input('topic'));

        if ($topic === 'payment') {
            $paymentId = $request->input('data.id', $request->input('id'));

            $order = Order::where('mp_payment_id', $paymentId)
                ->orWhere('mp_preference_id', $request->input('additional_info.external_reference'))
                ->first();

            if ($order && $paymentId) {
                // Nota: en producción conviene llamar a la API de MP para verificar el estado real
                Log::info('MercadoPago webhook recibido', [
                    'order_id'   => $order->id,
                    'payment_id' => $paymentId,
                    'type'       => $topic,
                ]);
            }
        }

        return response()->json(['status' => 'ok'], 200);
    }
}
