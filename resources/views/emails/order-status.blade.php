<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $order->status === 'approved' ? 'Pago confirmado' : ($order->status === 'in_process' ? 'Pago en proceso' : 'Pago rechazado') }}</title>
    <style>
        body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; }
        .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: #111827; padding: 32px 40px; text-align: center; }
        .header img { height: 40px; }
        .header h1 { color: #ffffff; font-size: 20px; margin: 12px 0 0; letter-spacing: 1px; }
        .badge { display: inline-block; margin: 32px auto 0; padding: 10px 28px; border-radius: 999px; font-size: 15px; font-weight: 700; }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-pending { background: #fef9c3; color: #a16207; }
        .badge-error   { background: #fee2e2; color: #b91c1c; }
        .body { padding: 36px 40px; }
        .body p { font-size: 15px; line-height: 1.7; color: #374151; margin: 0 0 20px; }
        .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
        .card-row { display: flex; justify-content: space-between; font-size: 14px; padding: 7px 0; border-bottom: 1px solid #e5e7eb; }
        .card-row:last-child { border-bottom: none; }
        .card-row .label { color: #6b7280; }
        .card-row .value { color: #111827; font-weight: 600; }
        .card-row .value-green { color: #16a34a; font-weight: 700; }
        .btn { display: block; width: fit-content; margin: 28px auto 0; padding: 14px 36px; background: #dc2626; color: #ffffff; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; }
        .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; }
        .footer a { color: #dc2626; text-decoration: none; }
    </style>
</head>
<body>
<div class="wrapper">
    {{-- Header --}}
    <div class="header">
        <h1>🏍️ Motos y Repuestos Speed</h1>
        @if($order->status === 'approved')
            <div class="badge badge-success">✅ Pago aprobado</div>
        @elseif($order->status === 'in_process')
            <div class="badge badge-pending">⏳ Pago en proceso</div>
        @else
            <div class="badge badge-error">❌ Pago rechazado</div>
        @endif
    </div>

    {{-- Body --}}
    <div class="body">
        <p>Hola{{ $order->buyer_name ? ', <strong>' . e($order->buyer_name) . '</strong>' : '' }},</p>

        @if($order->status === 'approved')
            <p>¡Excelente noticia! Tu pago fue procesado y confirmado exitosamente. Pronto nos pondremos en contacto contigo para coordinar la entrega.</p>
        @elseif($order->status === 'in_process')
            <p>Tu pago está siendo verificado por Mercado Pago. Este proceso puede tomar hasta <strong>24 horas</strong>. Te enviaremos otro correo cuando se confirme.</p>
        @else
            <p>Lamentablemente no pudimos procesar tu pago. Puedes intentarlo nuevamente desde nuestra tienda con otro medio de pago.</p>
        @endif

        {{-- Detalle de la orden --}}
        <div class="card">
            <div class="card-row">
                <span class="label">N° de orden</span>
                <span class="value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
            </div>
            @if($order->product)
            <div class="card-row">
                <span class="label">Producto</span>
                <span class="value">{{ $order->product->nombre }}</span>
            </div>
            <div class="card-row">
                <span class="label">Cantidad</span>
                <span class="value">{{ $order->quantity }}</span>
            </div>
            @endif
            <div class="card-row">
                <span class="label">Total</span>
                <span class="{{ $order->status === 'approved' ? 'value-green' : 'value' }}">
                    {{ $order->formatted_amount ?? '$' . number_format($order->amount, 0, ',', '.') }}
                </span>
            </div>
            @if($order->mp_payment_id)
            <div class="card-row">
                <span class="label">ID Mercado Pago</span>
                <span class="value" style="font-size:12px;font-family:monospace">{{ $order->mp_payment_id }}</span>
            </div>
            @endif
        </div>

        @if($order->status === 'approved')
            <a href="{{ route('home') }}" class="btn">Ir a la tienda</a>
        @elseif($order->status !== 'approved')
            <a href="{{ route('store.index') }}" class="btn">Ver catálogo</a>
        @endif
    </div>

    {{-- Footer --}}
    <div class="footer">
        <p>Este correo fue enviado automáticamente, por favor no respondas a este mensaje.</p>
        <p>¿Tienes preguntas? <a href="{{ route('home') }}">Contáctanos</a></p>
        <p style="margin-top:12px">&copy; {{ date('Y') }} Motos y Repuestos Speed. Todos los derechos reservados.</p>
    </div>
</div>
</body>
</html>
