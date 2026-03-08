@extends('layouts.app')

@section('title', 'Pago pendiente — MotoSpeed')

@section('content')
<section class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">

        {{-- Icono reloj --}}
        <div class="flex justify-center mb-6">
            <div class="w-24 h-24 rounded-full bg-yellow-600/20 flex items-center justify-center">
                <svg class="w-12 h-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l3 3" />
                </svg>
            </div>
        </div>

        <h1 class="text-3xl font-bold text-white mb-2">Pago en proceso</h1>
        <p class="text-gray-400 mb-8">
            Tu pago está siendo verificado. Te notificaremos por correo cuando se confirme.
            Esto puede tomar hasta 24 horas dependiendo del medio de pago.
        </p>

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
                <span>Estado</span>
                <span class="text-yellow-400 font-semibold">En proceso</span>
            </div>
        </div>
        @endif

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="{{ route('home') }}"
               class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
                Ir al inicio
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
            status:  'pending',
            @if($order)
            orderId: {{ json_encode(str_pad($order->id, 6, '0', STR_PAD_LEFT)) }},
            product: {{ json_encode($order->product?->nombre ?? '') }},
            @endif
        }, window.location.origin);
        setTimeout(function () { window.close(); }, 500);
    }
}());
</script>
@endpush
