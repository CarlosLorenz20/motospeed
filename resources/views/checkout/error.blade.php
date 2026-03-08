@extends('layouts.app')

@section('title', 'Error en el pago — MotoSpeed')

@section('content')
<section class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">

        {{-- Icono ✕ --}}
        <div class="flex justify-center mb-6">
            <div class="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center">
                <svg class="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </div>

        <h1 class="text-3xl font-bold text-white mb-2">Pago rechazado</h1>
        <p class="text-gray-400 mb-8">
            No pudimos procesar tu pago. Puedes intentarlo nuevamente con otro medio de pago.
        </p>

        @if(session('error'))
        <div class="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
            {{ session('error') }}
        </div>
        @endif

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
        </div>
        @endif

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            @if($order?->product)
            <a href="{{ route('store.show', $order->product->slug) }}"
               class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
                Intentar nuevamente
            </a>
            @endif
            <a href="{{ route('store.index') }}"
               class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors">
                Ver catálogo
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
            status:  'error',
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
