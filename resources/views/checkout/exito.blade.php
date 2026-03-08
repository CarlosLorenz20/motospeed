@extends('layouts.app')

@section('title', 'Pago Aprobado — MotoSpeed')

@section('content')
{{-- Hero de éxito --}}
<section class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">

        {{-- Icono ✓ --}}
        <div class="flex justify-center mb-6">
            <div class="w-24 h-24 rounded-full bg-green-600/20 flex items-center justify-center">
                <svg class="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>

        <h1 class="text-3xl font-bold text-white mb-2">¡Pago exitoso!</h1>
        <p class="text-gray-400 mb-8">
            Tu pedido fue recibido. Te enviaremos un correo de confirmación a la brevedad.
        </p>

        {{-- Resumen del pedido --}}
        @if($order)
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left mb-8 space-y-3">
            <div class="flex justify-between text-sm text-gray-400">
                <span>N° de orden</span>
                <span class="text-white font-mono">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
            </div>
            @if($order->product)
            <div class="flex justify-between text-sm text-gray-400">
                <span>Producto</span>
                <span class="text-white">{{ $order->product->nombre }}</span>
            </div>
            @endif
            <div class="flex justify-between text-sm text-gray-400">
                <span>Total pagado</span>
                <span class="text-green-400 font-semibold">{{ $order->formatted_amount }}</span>
            </div>
            @if($order->mp_payment_id)
            <div class="flex justify-between text-sm text-gray-400">
                <span>ID de pago MP</span>
                <span class="text-white font-mono text-xs">{{ $order->mp_payment_id }}</span>
            </div>
            @endif
        </div>
        @endif

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="{{ route('home') }}"
               class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
                Volver al inicio
            </a>
            <a href="{{ route('store.index') }}"
               class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors">
                Seguir comprando
            </a>
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
(function () {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
            type:    'mp_payment',
            status:  'success',
            @if($order)
            orderId: {{ json_encode(str_pad($order->id, 6, '0', STR_PAD_LEFT)) }},
            product: {{ json_encode($order->product?->nombre ?? '') }},
            amount:  {{ json_encode($order->formatted_amount ?? '') }},
            @endif
        }, window.location.origin);
        setTimeout(function () { window.close(); }, 500);
    }
}());
</script>
@endpush
