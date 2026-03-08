@extends('layouts.app')
@section('title', $producto->nombre)
@section('description', Str::limit($producto->descripcion, 150))

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    {{-- Breadcrumb --}}
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="{{ route('home') }}" class="hover:text-red-600 transition-colors">Inicio</a>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="{{ route('store.index') }}" class="hover:text-red-600 transition-colors">Tienda</a>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="{{ route('store.index', ['categoria' => $producto->category->slug]) }}" class="hover:text-red-600 transition-colors">{{ $producto->category->nombre }}</a>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-gray-800 font-medium truncate max-w-[200px]">{{ $producto->nombre }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

        {{-- ─── IMAGEN ──────────────────────────────────────────────────────── --}}
        <div class="space-y-4">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden aspect-square flex items-center justify-center p-8">
                @if($producto->imagen)
                    <img src="{{ asset('storage/' . $producto->imagen) }}"
                         alt="{{ $producto->nombre }}"
                         class="w-full h-full object-contain">
                @else
                    <div class="flex flex-col items-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-32 h-32 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p class="text-sm text-gray-400">Sin imagen disponible</p>
                    </div>
                @endif
            </div>
            {{-- Badges --}}
            <div class="flex flex-wrap gap-2">
                @if($producto->precio_oferta)
                    <span class="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">-{{ $producto->descuento_porcentaje }}% OFF</span>
                @endif
                @if($producto->destacado)
                    <span class="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        Producto Destacado
                    </span>
                @endif
                <span class="{{ $producto->stock > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600' }} text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    @if($producto->stock > 0)
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                        En Stock ({{ $producto->stock }} uds.)
                    @else
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                        Sin Stock
                    @endif
                </span>
            </div>
        </div>

        {{-- ─── INFO ────────────────────────────────────────────────────────── --}}
        <div class="flex flex-col gap-5">
            <div>
                <span class="text-xs font-semibold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                    <x-category-icon :slug="$producto->category->slug" class="w-4 h-4" />
                    {{ $producto->category->nombre }}
                </span>
                <h1 class="text-3xl font-extrabold text-gray-900 mt-2 leading-tight">{{ $producto->nombre }}</h1>
                @if($producto->sku)
                    <p class="text-xs text-gray-400 mt-1">SKU: {{ $producto->sku }}</p>
                @endif
            </div>

            {{-- Precio --}}
            <div class="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                @if($producto->precio_oferta)
                    <div class="flex items-end gap-3">
                        <span class="text-4xl font-extrabold text-red-600">{{ $producto->precio_oferta_formateado }}</span>
                        <div class="mb-1">
                            <span class="text-base text-gray-400 line-through">{{ $producto->precio_formateado }}</span>
                            <span class="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{{ $producto->descuento_porcentaje }}%</span>
                        </div>
                    </div>
                @else
                    <span class="text-4xl font-extrabold text-gray-900">{{ $producto->precio_formateado }}</span>
                @endif
                <p class="text-xs text-gray-400 mt-2">Precio en pesos chilenos (CLP) · IVA incluido</p>
            </div>

            {{-- Especificaciones --}}
            @if($producto->marca || $producto->modelo_compatible)
            <div class="grid grid-cols-2 gap-3">
                @if($producto->marca)
                <div class="bg-white rounded-xl border border-gray-100 p-3">
                    <p class="text-xs text-gray-400 mb-1">Marca</p>
                    <p class="font-semibold text-gray-800">{{ $producto->marca }}</p>
                </div>
                @endif
                @if($producto->modelo_compatible)
                <div class="bg-white rounded-xl border border-gray-100 p-3">
                    <p class="text-xs text-gray-400 mb-1">Compatible con</p>
                    <p class="font-semibold text-gray-800 text-sm">{{ $producto->modelo_compatible }}</p>
                </div>
                @endif
            </div>
            @endif

            {{-- Descripción --}}
            <div>
                <h3 class="font-bold text-gray-900 mb-2">Descripción</h3>
                <p class="text-gray-600 text-sm leading-relaxed">{{ $producto->descripcion }}</p>
            </div>

            {{-- CTA --}}
            <div class="flex flex-col gap-3 pt-2">
                @if($producto->stock > 0)
                    {{-- Botón Mercado Pago --}}
                    @auth
                        <form id="mpPaymentForm" method="POST" action="{{ route('checkout.pagar') }}">
                            @csrf
                            <input type="hidden" name="product_id" value="{{ $producto->id }}">
                            <input type="hidden" name="quantity" value="1">
                            <button type="submit" id="mpPayButton"
                                    class="w-full flex items-center justify-center gap-3 py-4 bg-[#009EE3] hover:bg-[#0082BB] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg class="w-7 h-7 fill-current" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm0 5c8.3 0 15 6.7 15 15s-6.7 15-15 15S9 32.3 9 24 15.7 9 24 9zm-7.5 10c0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5H16.5z"/>
                                </svg>
                                <span id="mpButtonText">Pagar con Mercado Pago</span>
                            </button>
                        </form>

                        {{-- Modal de estado de pago --}}
                        <div id="paymentModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                                <div id="modalLoading">
                                    <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Procesando pago...</h3>
                                    <p class="text-gray-500 text-sm">Completa el pago en la ventana de Mercado Pago</p>
                                </div>
                                <div id="modalSuccess" class="hidden">
                                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h3>
                                    <p class="text-gray-500 text-sm mb-4">Tu pedido fue procesado correctamente</p>
                                    <a href="{{ route('store.index') }}" class="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">Continuar comprando</a>
                                </div>
                                <div id="modalError" class="hidden">
                                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </div>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">Pago rechazado</h3>
                                    <p class="text-gray-500 text-sm mb-4">No pudimos procesar tu pago</p>
                                    <button onclick="closeModal()" class="inline-block px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors">Intentar de nuevo</button>
                                </div>
                            </div>
                        </div>
                    @else
                        <a href="{{ route('login') }}"
                           class="w-full flex items-center justify-center gap-3 py-4 bg-[#009EE3] hover:bg-[#0082BB] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                            Inicia sesión para comprar
                        </a>
                    @endauth

                    <div class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <svg class="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        <div>
                            <p class="text-xs font-semibold text-blue-800">Pago 100% seguro</p>
                            <p class="text-xs text-blue-600">Procesado por <strong>Mercado Pago</strong> · Débito, Crédito y más</p>
                        </div>
                    </div>
                @else
                    <div class="w-full py-4 bg-gray-100 rounded-2xl text-center text-gray-500 font-bold text-lg">
                        Sin Stock disponible
                    </div>
                    <p class="text-sm text-gray-500 text-center">¿Te interesa? <a href="#" class="text-red-600 hover:underline font-medium">Contáctanos por WhatsApp</a></p>
                @endif

                <a href="https://wa.me/56912345678?text=Hola,%20me%20interesa%20el%20producto:%20{{ urlencode($producto->nombre) }}"
                   target="_blank"
                   class="w-full flex items-center justify-center gap-2 py-3 border border-green-300 text-green-700 hover:bg-green-50 font-semibold rounded-2xl transition-colors">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    Consultar por WhatsApp
                </a>
            </div>
        </div>
    </div>

    {{-- ─── PRODUCTOS RELACIONADOS ──────────────────────────────────────── --}}
    @if($relacionados->count())
    <div>
        <h2 class="text-2xl font-extrabold text-gray-900 mb-6">También te puede interesar</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach($relacionados as $rel)
                <x-product-card :producto="$rel"/>
            @endforeach
        </div>
    </div>
    @endif
</div>
@endsection

@auth
@push('scripts')
<script>
(function() {
    const form = document.getElementById('mpPaymentForm');
    const button = document.getElementById('mpPayButton');
    const buttonText = document.getElementById('mpButtonText');
    const modal = document.getElementById('paymentModal');
    const modalLoading = document.getElementById('modalLoading');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalError = document.getElementById('modalError');
    
    let paymentPopup = null;
    let checkPopupInterval = null;

    if (!form) return;

    // Escuchar mensajes del popup
    window.addEventListener('message', function(event) {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== 'mp_payment') return;

        clearInterval(checkPopupInterval);
        
        if (event.data.status === 'success') {
            showModalState('success');
        } else {
            showModalState('error');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mostrar modal de carga
        showModal();
        showModalState('loading');
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        
        // Hacer petición AJAX para obtener la URL de MP
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.redirect_url) {
                // Abrir popup con la URL de MP
                const width = 500;
                const height = 700;
                const left = (screen.width - width) / 2;
                const top = (screen.height - height) / 2;
                
                paymentPopup = window.open(
                    data.redirect_url,
                    'MercadoPago',
                    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
                );

                // Verificar si el popup se cerró sin completar
                checkPopupInterval = setInterval(function() {
                    if (paymentPopup && paymentPopup.closed) {
                        clearInterval(checkPopupInterval);
                        // El popup se cerró, verificar si recibimos mensaje
                        setTimeout(function() {
                            if (modal.classList.contains('hidden') === false && 
                                !modalSuccess.classList.contains('hidden') === false &&
                                !modalError.classList.contains('hidden') === false) {
                                hideModal();
                            }
                        }, 1000);
                    }
                }, 500);
            } else if (data.error) {
                showModalState('error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModalState('error');
        });
    });

    function showModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function showModalState(state) {
        modalLoading.classList.add('hidden');
        modalSuccess.classList.add('hidden');
        modalError.classList.add('hidden');
        
        if (state === 'loading') modalLoading.classList.remove('hidden');
        if (state === 'success') modalSuccess.classList.remove('hidden');
        if (state === 'error') modalError.classList.remove('hidden');
    }

    window.closeModal = hideModal;
})();
</script>
@endpush
@endauth
