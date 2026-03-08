@extends('layouts.app')
@section('title', 'Servicios')
@section('description', 'Conoce todos los servicios que ofrece Motos y Repuestos Speed.')

@section('content')

{{-- ─── HERO con Parallax ────────────────────────────────────────────────── --}}
<section data-parallax class="relative bg-gray-900 overflow-hidden py-20 sm:py-28">
    <div data-parallax-layer="0.25" class="absolute inset-0 opacity-15 pointer-events-none"
         style="background-image: radial-gradient(circle at 70% 50%, #ef4444 0%, transparent 60%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%);">
    </div>
    <div data-parallax-layer="0.12" class="absolute inset-0 pointer-events-none">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-red-600/5 rounded-full blur-3xl"></div>
        <div class="absolute -left-20 bottom-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl"></div>
    </div>
    <div data-parallax-layer="0.05" class="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span class="inline-block bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">Nuestros Servicios</span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">Lo que hacemos por tu moto</h1>
        <p class="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">Mas que una tienda, somos tu centro integral de moto. Desde la venta hasta el mantenimiento.</p>
    </div>
</section>

{{-- ─── Servicios principales ───────────────────────────────── --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        @php
        $servicios = [
            ['svg'=>'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>','bg'=>'bg-blue-50','tc'=>'text-blue-600','title'=>'Mantenimiento Preventivo','desc'=>'Revision completa de tu moto: aceite, filtros, frenos, cadena y ajuste general.','items'=>['Cambio de aceite y filtro','Revision frenos y neumaticos','Ajuste de cadena y valvulas','Limpieza de carburador/inyeccion']],
            ['svg'=>'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>','bg'=>'bg-red-50','tc'=>'text-red-600','title'=>'Reparacion de Motor','desc'=>'Mecanicos certificados para reparaciones de motor, transmision y sistema de escape.','items'=>['Rectificacion de cilindro','Cambio de piston y segmentos','Reparacion de culata','Diagnostico electronico']],
            ['svg'=>'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>','bg'=>'bg-green-50','tc'=>'text-green-600','title'=>'Instalacion de Accesorios','desc'=>'Instalacion profesional de accesorios, portaequipajes y sistemas de iluminacion.','items'=>['Portaequipajes y maletas','Sistemas LED personalizados','Protecciones y crash bars','GPS y alarmas']],
            ['svg'=>'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>','bg'=>'bg-orange-50','tc'=>'text-orange-600','title'=>'Venta de Motos','desc'=>'Amplio stock de motos nuevas de las principales marcas con financiamiento.','items'=>['Honda, Yamaha, Suzuki','Motos de trabajo y sport','Scooters y enduro','Financiamiento disponible']],
            ['svg'=>'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>','bg'=>'bg-purple-50','tc'=>'text-purple-600','title'=>'Repuestos y Accesorios','desc'=>'Catalogo completo de repuestos genuinos y accesorios para todas las marcas y modelos.','items'=>['Repuestos originales','Partes de motor','Sistema electrico','Equipamiento para el piloto']],
            ['svg'=>'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13M10 12l2 2 4-4"/>','bg'=>'bg-indigo-50','tc'=>'text-indigo-600','title'=>'Envios a Todo Chile','desc'=>'Despacho express a cualquier region del pais. Embalaje seguro para todos los productos.','items'=>['Envio en 24-72 horas','Regiones extremas disponibles','Tracking en tiempo real','Seguro de envio incluido']],
        ];
        @endphp
        @foreach($servicios as $i => $s)
        <div data-reveal data-reveal-delay="{{ min($i * 100, 400) }}"
             class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 sm:p-6 group flex flex-col">
            <div class="w-12 h-12 {{ $s['bg'] }} rounded-xl flex items-center justify-center {{ $s['tc'] }} mb-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{!! $s['svg'] !!}</svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{{ $s['title'] }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-4">{{ $s['desc'] }}</p>
            <ul class="space-y-2 mt-auto">
                @foreach($s['items'] as $item)
                <li class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    {{ $item }}
                </li>
                @endforeach
            </ul>
        </div>
        @endforeach
    </div>
</section>

{{-- ─── Estadisticas ────────────────────────────────────────── --}}
<section class="bg-gray-900 py-16 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-12" data-reveal>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Mas de 10 anos de experiencia</h2>
            <p class="text-gray-400 mt-3 text-sm sm:text-base">Somos el taller y tienda de confianza de miles de moteros en Chile</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            @foreach([['num'=>'10+','label'=>'Anos en el mercado'],['num'=>'5.000+','label'=>'Clientes satisfechos'],['num'=>'500+','label'=>'Productos en stock'],['num'=>'100%','label'=>'Garantia de calidad']] as $i => $stat)
            <div data-reveal data-reveal-delay="{{ $i * 100 }}" class="bg-gray-800 rounded-2xl p-4 sm:p-6">
                <p class="text-2xl sm:text-3xl font-extrabold text-red-500 mb-1">{{ $stat['num'] }}</p>
                <p class="text-xs sm:text-sm text-gray-400">{{ $stat['label'] }}</p>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ─── CTA ─────────────────────────────────────────────────── --}}
<section class="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
    <div class="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-3xl p-8 sm:p-10" data-reveal>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">Necesitas ayuda con tu moto?</h2>
        <p class="text-gray-600 mb-8 text-base sm:text-lg">Nuestro equipo esta listo para ayudarte. Contactanos via WhatsApp o visitanos en Santiago.</p>
        <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <a href="https://wa.me/56912345678" target="_blank"
               class="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-colors shadow-lg">
                <svg class="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Escribir por WhatsApp
            </a>
            <a href="{{ route('store.index') }}"
               class="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors shadow-lg">
                <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Ver Tienda
            </a>
        </div>
    </div>
</section>

@endsection
