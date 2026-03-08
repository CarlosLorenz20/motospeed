@extends('layouts.app')
@section('title', 'Inicio')
@section('description', 'Motos y Repuestos Speed - Tu tienda online de repuestos y accesorios para motos en Chile.')

@section('content')

{{-- ─── HERO con Parallax ────────────────────────────────────────────────── --}}
<section data-parallax class="relative bg-gray-900 overflow-hidden">
    {{-- Capa de fondo decorativa (mueve lento) --}}
    <div data-parallax-layer="0.25" class="absolute inset-0 opacity-20 pointer-events-none"
         style="background-image: radial-gradient(circle at 20% 50%, #ef4444 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f97316 0%, transparent 40%);">
    </div>
    <div data-parallax-layer="0.15" class="absolute right-0 top-0 h-full w-1/2 opacity-5 hidden lg:block pointer-events-none"
         style="background: radial-gradient(circle at center, #fff 0%, transparent 70%);">
    </div>

    {{-- Contenido (se mueve muy lento para dar profundidad) --}}
    <div data-parallax-layer="0.05" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-6">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span class="text-red-300 text-sm font-medium">Envíos a todo Chile</span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Tu Tienda de
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                    Motos y Repuestos
                </span>
                en Chile
            </h1>
            <p class="text-gray-400 text-lg leading-relaxed mb-8">
                Encuentra motos, repuestos genuinos y accesorios al mejor precio. Calidad garantizada con soporte técnico experto.
            </p>
            <div class="flex flex-wrap gap-4">
                <a href="{{ route('store.index') }}"
                   class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-900/30 transition-all active:scale-95">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    Ir a la Tienda
                </a>
                <a href="{{ route('services.index') }}"
                   class="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all">
                    Nuestros Servicios →
                </a>
            </div>

            {{-- Quick stats --}}
            <div class="flex flex-wrap gap-6 mt-12 pt-10 border-t border-gray-800">
                <div>
                    <p class="text-2xl font-extrabold text-white">500+</p>
                    <p class="text-sm text-gray-500">Productos disponibles</p>
                </div>
                <div>
                    <p class="text-2xl font-extrabold text-white">8</p>
                    <p class="text-sm text-gray-500">Categorías</p>
                </div>
                <div>
                    <p class="text-2xl font-extrabold text-white">100%</p>
                    <p class="text-sm text-gray-500">Garantía de calidad</p>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- ─── CATEGORÍAS ───────────────────────────────────────────────────────── --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-10" data-reveal>
        <h2 class="text-3xl font-extrabold text-gray-900">Explora por Categoría</h2>
        <p class="text-gray-500 mt-2">Encuentra exactamente lo que necesitas para tu moto</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        @foreach($categorias as $cat)
        <a href="{{ route('store.index', ['categoria' => $cat->slug]) }}"
           data-reveal data-reveal-delay="{{ $loop->index * 50 > 600 ? 600 : $loop->index * 50 }}"
           class="group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50 shadow-sm hover:shadow transition-all text-center">
            <span class="text-red-600 group-hover:text-red-700">
                <x-category-icon :slug="$cat->slug" class="w-8 h-8" />
            </span>
            <span class="text-xs font-semibold text-gray-700 group-hover:text-red-700 leading-tight">{{ $cat->nombre }}</span>
        </a>
        @endforeach
    </div>
</section>

{{-- ─── PRODUCTOS DESTACADOS ─────────────────────────────────────────────── --}}
@if($productosDestacados->count())
<section class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-10" data-reveal>
            <div>
                <h2 class="text-3xl font-extrabold text-gray-900">Productos Destacados</h2>
                <p class="text-gray-500 mt-1">Los más populares de nuestra tienda</p>
            </div>
            <a href="{{ route('store.index') }}"
               class="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                Ver todos <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>

        {{-- Skeleton + contenido real envueltos --}}
        <div data-skeleton-wrapper="600">

            {{-- Skeleton placeholders --}}
            <div data-skeleton class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @for($i = 0; $i < 4; $i++)
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="skeleton-box aspect-square w-full"></div>
                    <div class="p-4 space-y-3">
                        <div class="skeleton-box h-3 w-1/3 rounded-full"></div>
                        <div class="skeleton-box h-4 w-full rounded"></div>
                        <div class="skeleton-box h-4 w-3/4 rounded"></div>
                        <div class="skeleton-box h-6 w-1/2 rounded mt-2"></div>
                        <div class="skeleton-box h-9 w-full rounded-xl mt-1"></div>
                    </div>
                </div>
                @endfor
            </div>

            {{-- Contenido real - Carrusel 3D --}}
            <div data-skeleton-content class="opacity-0 transition-opacity duration-500">
                <div id="featured-carousel" class="relative select-none">

                    {{-- Botón Anterior --}}
                    <button id="carousel-prev" type="button"
                            class="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-20
                                   w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 shadow-lg rounded-full
                                   flex items-center justify-center
                                   text-gray-600 hover:text-red-600 hover:border-red-300
                                   transition-all active:scale-90">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>

                    {{-- Botón Siguiente --}}
                    <button id="carousel-next" type="button"
                            class="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-20
                                   w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 shadow-lg rounded-full
                                   flex items-center justify-center
                                   text-gray-600 hover:text-red-600 hover:border-red-300
                                   transition-all active:scale-90">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>

                    {{-- Escenario 3D --}}
                    <div id="carousel-3d-wrap" class="relative h-[340px] sm:h-[360px]" style="perspective:1000px;">
                        <div id="carousel-3d-track" style="transform-style:preserve-3d;width:100%;height:100%;position:relative;">
                            @foreach($productosDestacados as $producto)
                            <a href="{{ route('store.show', $producto->slug) }}"
                               class="carousel-slide absolute top-0 block rounded-2xl overflow-hidden bg-white border border-gray-100"
                               style="width:210px;left:50%;margin-left:-105px;
                                      transition:transform 0.65s cubic-bezier(.25,.46,.45,.94),opacity 0.65s ease,box-shadow 0.65s ease;">

                                {{-- Imagen --}}
                                <div class="relative bg-gray-100" style="height:210px;">
                                    @if($producto->imagen)
                                        <img src="{{ asset('storage/' . $producto->imagen) }}"
                                             alt="{{ $producto->nombre }}"
                                             class="w-full h-full object-cover">
                                    @else
                                        <div class="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg class="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        </div>
                                    @endif
                                    {{-- Badges --}}
                                    @if($producto->precio_oferta)
                                        <span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            -{{ $producto->descuento_porcentaje }}%
                                        </span>
                                    @endif
                                    @if($producto->destacado)
                                        <span class="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">&#9733;</span>
                                    @endif
                                </div>

                                {{-- Info --}}
                                <div class="p-3">
                                    <p class="text-xs text-red-500 font-medium uppercase tracking-wide truncate mb-0.5">{{ $producto->category->nombre }}</p>
                                    <p class="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2">{{ $producto->nombre }}</p>
                                    <div class="flex items-center justify-between">
                                        @if($producto->precio_oferta)
                                            <div>
                                                <span class="text-base font-extrabold text-red-600">${{ number_format($producto->precio_oferta, 0, ',', '.') }}</span>
                                                <span class="text-xs text-gray-400 line-through ml-1">${{ number_format($producto->precio, 0, ',', '.') }}</span>
                                            </div>
                                        @else
                                            <span class="text-base font-extrabold text-gray-900">${{ number_format($producto->precio, 0, ',', '.') }}</span>
                                        @endif
                                        <span class="text-xs text-red-600 font-semibold">Ver &rarr;</span>
                                    </div>
                                </div>

                            </a>
                            @endforeach
                        </div>
                    </div>

                    {{-- Dots --}}
                    <div id="carousel-dots" class="flex justify-center items-center gap-2 mt-5"></div>

                </div>
            </div>

        </div>

        <div class="text-center mt-10 sm:hidden">
            <a href="{{ route('store.index') }}" class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
                Ver todos los productos
            </a>
        </div>
    </div>
</section>
@endif

{{-- ─── POR QUÉ ELEGIRNOS ────────────────────────────────────────────────── --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="text-center mb-12" data-reveal>
        <h2 class="text-3xl font-extrabold text-gray-900">¿Por qué elegirnos?</h2>
        <p class="text-gray-500 mt-2 max-w-lg mx-auto">Llevamos años siendo el referente en repuestos y motos en Chile</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {{-- Envío --}}
        <div data-reveal data-reveal-delay="100" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-4 text-red-500">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13M10 12l2 2 4-4"/></svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Envío a Todo Chile</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Despacho rápido y seguro a cualquier región del país.</p>
        </div>

        {{-- Garantía --}}
        <div data-reveal data-reveal-delay="200" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-4 text-green-500">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Repuestos Genuinos</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Solo trabajamos con marcas certificadas y proveedores confiables.</p>
        </div>

        {{-- Técnico --}}
        <div data-reveal data-reveal-delay="300" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-4 text-blue-500">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Asistencia Técnica</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Equipo experto disponible para asesorarte en tu compra.</p>
        </div>

        {{-- Mercado Pago --}}
        <div data-reveal data-reveal-delay="400" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div class="flex justify-center mb-4 text-[#009EE3]">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Pago Seguro</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Pagos procesados por <strong>Mercado Pago</strong> — débito, crédito y más.</p>
        </div>

    </div>
</section>

{{-- ─── CTA FINAL ────────────────────────────────────────────────────────── --}}
<section class="bg-gradient-to-r from-red-600 to-orange-500 py-16">
    <div class="max-w-3xl mx-auto px-4 text-center" data-reveal>
        <h2 class="text-3xl font-extrabold text-white mb-4">¿Listo para encontrar lo que necesitas?</h2>
        <p class="text-red-100 text-lg mb-8">Navega nuestra tienda y encuentra los mejores repuestos al mejor precio.</p>
        <a href="{{ route('store.index') }}"
           class="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-extrabold rounded-2xl hover:bg-red-50 transition-colors shadow-xl text-lg">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            Entrar a la Tienda
        </a>
    </div>
</section>

@endsection
