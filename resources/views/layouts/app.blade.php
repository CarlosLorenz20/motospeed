<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'MotoSpeed') | Motos y Repuestos Speed</title>
    <meta name="description" content="@yield('description', 'Tu tienda online de motos y repuestos en Chile.')">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body class="bg-gray-50 text-gray-900 font-[Inter] antialiased">

    {{-- ─── NAVBAR ─────────────────────────────────────────────────────────── --}}
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">

                {{-- Logo --}}
                <a href="{{ route('home') }}" class="flex items-center gap-2 shrink-0">
                    <div class="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow">
                        <span class="text-white font-black text-sm leading-none">MS</span>
                    </div>
                    <div class="hidden sm:block">
                        <span class="font-extrabold text-gray-900 text-base leading-tight block">MotoSpeed</span>
                        <span class="text-xs text-gray-500 leading-tight block">Repuestos &amp; Accesorios</span>
                    </div>
                </a>

                {{-- Nav links (desktop) --}}
                <div class="hidden md:flex items-center gap-1">
                    <a href="{{ route('home') }}"
                       class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                              {{ request()->routeIs('home') ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                        Inicio
                    </a>
                    <a href="{{ route('store.index') }}"
                       class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                              {{ request()->routeIs('store.*') ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                        Tienda
                    </a>
                    <a href="{{ route('services.index') }}"
                       class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                              {{ request()->routeIs('services.*') ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' }}">
                        Servicios
                    </a>
                </div>

                {{-- Right side --}}
                <div class="flex items-center gap-2">
                    {{-- Search icon --}}
                    <a href="{{ route('store.index') }}" class="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors" title="Buscar productos">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </a>

                    @auth
                        {{-- User dropdown (vanilla JS, sin dependencia de Preline) --}}
                        <div class="relative" data-dropdown-container>
                            <button type="button" data-dropdown-toggle
                                    class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors text-sm font-medium text-gray-700">
                                <div class="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                                    <span class="text-red-700 font-bold text-xs">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</span>
                                </div>
                                <span class="hidden sm:inline">{{ Str::limit(auth()->user()->name, 12) }}</span>
                                <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" data-dropdown-chevron
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>

                            <div data-dropdown-menu
                                 class="hidden absolute right-0 mt-2 min-w-[210px] bg-white shadow-lg rounded-xl border border-gray-100 p-1.5 z-50">
                                <div class="px-3 py-2 mb-1 border-b border-gray-100">
                                    <p class="text-xs text-gray-500">Conectado como</p>
                                    <p class="text-sm font-semibold text-gray-800 truncate">{{ auth()->user()->email }}</p>
                                    @if(auth()->user()->isAdmin())
                                        <span class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Administrador
                                        </span>
                                    @endif
                                </div>

                                @if(auth()->user()->isAdmin())
                                    <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                                        Panel Admin
                                    </a>
                                @endif

                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                        Cerrar Sesión
                                    </button>
                                </form>
                            </div>
                        </div>
                    @else
                        <a href="{{ route('login') }}"
                           class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors hidden sm:inline-flex">
                            Iniciar Sesión
                        </a>
                        <a href="{{ route('register') }}"
                           class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                            Registrarse
                        </a>
                    @endauth

                    {{-- Mobile hamburger --}}
                    <button id="mobile-menu-toggle" type="button"
                            class="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Menú">
                        {{-- Icono hamburgesa --}}
                        <svg id="menu-icon-open" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        {{-- Icono X --}}
                        <svg id="menu-icon-close" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            {{-- Mobile menu --}}
            <div id="mobile-menu" class="hidden md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
                <div class="flex flex-col gap-1">
                    <a href="{{ route('home') }}" class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium {{ request()->routeIs('home') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50' }}">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Inicio
                    </a>
                    <a href="{{ route('store.index') }}" class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium {{ request()->routeIs('store.*') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50' }}">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        Tienda
                    </a>
                    <a href="{{ route('services.index') }}" class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium {{ request()->routeIs('services.*') ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50' }}">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        Servicios
                    </a>
                    @guest
                        <hr class="border-gray-100 my-1">
                        <a href="{{ route('login') }}" class="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Iniciar Sesión</a>
                    @endguest
                </div>
            </div>
        </nav>
    </header>

    {{-- ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────── --}}
    @php
        $toasts = array_filter([
            session('success') ? ['type'=>'success','msg'=>session('success')] : null,
            session('error')   ? ['type'=>'error',  'msg'=>session('error')]   : null,
            session('warning') ? ['type'=>'warning','msg'=>session('warning')] : null,
            session('info')    ? ['type'=>'info',   'msg'=>session('info')]    : null,
        ]);
    @endphp

    @if(count($toasts))
    {{-- Backdrop solo en mobile (bloquea clics fuera mientras el toast está visible) --}}
    <div id="toast-backdrop"
         class="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[1px] md:hidden"
         onclick="dismissAllToasts()"></div>

    {{-- Contenedor: esquina inferior-derecha en md+, centrado en mobile --}}
    <div id="toast-container"
         class="fixed z-[9999] flex flex-col gap-3
                bottom-0 left-0 right-0 p-4 items-center
                md:bottom-6 md:right-6 md:left-auto md:p-0 md:items-end md:max-w-xs">

        @foreach(array_values($toasts) as $i => $toast)
        @php
            $cfg = match($toast['type']) {
                'success' => ['bg'=>'bg-white','border'=>'border-green-400','icon_color'=>'text-green-500','bar'=>'bg-green-400',
                    'icon'=>'<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'],
                'error'   => ['bg'=>'bg-white','border'=>'border-red-400',  'icon_color'=>'text-red-500',  'bar'=>'bg-red-400',
                    'icon'=>'<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'],
                'warning' => ['bg'=>'bg-white','border'=>'border-yellow-400','icon_color'=>'text-yellow-500','bar'=>'bg-yellow-400',
                    'icon'=>'<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>'],
                default   => ['bg'=>'bg-white','border'=>'border-blue-400', 'icon_color'=>'text-blue-500', 'bar'=>'bg-blue-400',
                    'icon'=>'<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>'],
            };
        @endphp
        <div id="toast-{{ $i }}"
             data-delay="{{ 4500 + $i * 600 }}"
             role="alert"
             class="toast-item w-full md:w-72 {{ $cfg['bg'] }} {{ $cfg['border'] }} border-l-4
                    rounded-xl shadow-xl overflow-hidden
                    flex items-start gap-3 p-4
                    transition-all duration-300 ease-out
                    translate-y-0 opacity-100
                    md:translate-x-0">

            {{-- Icono --}}
            <svg class="w-5 h-5 {{ $cfg['icon_color'] }} shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                {!! $cfg['icon'] !!}
            </svg>

            {{-- Texto --}}
            <p class="text-sm font-medium text-gray-800 flex-1 leading-snug">{{ $toast['msg'] }}</p>

            {{-- Cerrar --}}
            <button onclick="dismissToast(document.getElementById('toast-{{ $i }}'))"
                    class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-0.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>

            {{-- Barra de progreso animada --}}
            <span class="toast-bar {{ $cfg['bar'] }} absolute bottom-0 left-0 h-0.5 w-full origin-left"
                  style="animation: toast-progress {{ (4500 + $i * 600) }}ms linear forwards;"></span>
        </div>
        @endforeach
    </div>

    <style>
        @keyframes toast-progress {
            from { transform: scaleX(1); }
            to   { transform: scaleX(0); }
        }
        .toast-item { position: relative; }
        .toast-hiding {
            opacity: 0 !important;
            transform: translateY(0.5rem) !important;
            pointer-events: none;
        }
        @media (min-width: 768px) {
            .toast-hiding { transform: translateX(110%) !important; }
        }
    </style>

    <script>
        function dismissToast(el) {
            if (!el) return;
            el.classList.add('toast-hiding');
            setTimeout(() => {
                el.remove();
                cleanupToasts();
            }, 300);
        }
        function dismissAllToasts() {
            document.querySelectorAll('.toast-item').forEach(dismissToast);
        }
        function cleanupToasts() {
            const container  = document.getElementById('toast-container');
            const backdrop   = document.getElementById('toast-backdrop');
            if (container && !container.querySelector('.toast-item')) {
                container.remove();
                if (backdrop) backdrop.remove();
            }
        }
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.toast-item[data-delay]').forEach(function (el) {
                var delay = parseInt(el.getAttribute('data-delay'), 10);
                setTimeout(function () { dismissToast(el); }, delay);
            });
        });
    </script>
    @endif

    {{-- ─── MAIN CONTENT ────────────────────────────────────────────────────── --}}
    <main>
        @yield('content')
    </main>

    {{-- ─── FOOTER ──────────────────────────────────────────────────────────── --}}
    <footer class="bg-gray-900 text-gray-300 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {{-- Brand --}}
                <div class="lg:col-span-2">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                            <span class="text-white font-black text-sm">MS</span>
                        </div>
                        <div>
                            <p class="font-extrabold text-white text-lg leading-tight">Motos y Repuestos Speed</p>
                            <p class="text-xs text-gray-400">Tu aliado en moto &amp; repuestos · Chile</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-400 leading-relaxed max-w-sm">
                        Tu tienda de confianza para motos, repuestos y accesorios. Calidad garantizada y los mejores precios del mercado chileno.
                    </p>
                    <div class="flex gap-3 mt-5">
                        <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="#" class="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="https://wa.me/56912345678" class="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors" aria-label="WhatsApp">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </a>
                    </div>
                </div>

                {{-- Links --}}
                <div>
                    <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navegación</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="{{ route('home') }}" class="text-gray-400 hover:text-red-400 transition-colors">Inicio</a></li>
                        <li><a href="{{ route('store.index') }}" class="text-gray-400 hover:text-red-400 transition-colors">Tienda</a></li>
                        <li><a href="{{ route('services.index') }}" class="text-gray-400 hover:text-red-400 transition-colors">Servicios</a></li>
                        <li><a href="{{ route('login') }}" class="text-gray-400 hover:text-red-400 transition-colors">Mi Cuenta</a></li>
                    </ul>
                </div>

                {{-- Contact --}}
                <div>
                    <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contacto</h4>
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-start gap-2 text-gray-400">
                            <svg class="w-4 h-4 mt-0.5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            Santiago, Chile
                        </li>
                        <li class="flex items-center gap-2 text-gray-400">
                            <svg class="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            +56 9 1234 5678
                        </li>
                        <li class="flex items-center gap-2 text-gray-400">
                            <svg class="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            contacto@motosyrepuestosspeed.cl
                        </li>
                    </ul>
                    <div class="mt-4 p-3 bg-gray-800 rounded-lg">
                        <p class="text-xs text-gray-400 mb-1">Pagos procesados por:</p>
                        <div class="flex items-center gap-2">
                            <span class="bg-[#009EE3] text-white text-xs font-bold px-2 py-1 rounded">Mercado Pago</span>
                            <span class="text-xs text-gray-500">Débito · Crédito · Transferencia</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                <p>&copy; {{ date('Y') }} Motos y Repuestos Speed. Todos los derechos reservados.</p>
                <p class="flex items-center gap-1.5">Hecho con <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> en Venezuela</p>
            </div>
        </div>
    </footer>

    {{-- SweetAlert2: notificaciones de pago --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
    <script>
    window.addEventListener('message', function (e) {
        if (e.origin !== window.location.origin) return;
        const d = e.data;
        if (!d || d.type !== 'mp_payment') return;
        const theme = { background: '#111827', color: '#f9fafb', confirmButtonColor: '#dc2626' };
        if (d.status === 'success') {
            Swal.fire(Object.assign({}, theme, {
                icon: 'success',
                title: '¡Pago aprobado!',
                html: d.product
                    ? '<b>' + d.product + '</b><br><small>Orden #' + d.orderId + ' &mdash; ' + d.amount + '</small>'
                    : '¡Tu pago fue procesado correctamente!',
                confirmButtonText: 'Entendido',
            }));
        } else if (d.status === 'error') {
            Swal.fire(Object.assign({}, theme, {
                icon: 'error',
                title: 'Pago rechazado',
                text: 'No pudimos procesar tu pago. Intenta con otro medio de pago.',
                confirmButtonText: 'Cerrar',
            }));
        } else if (d.status === 'pending') {
            Swal.fire(Object.assign({}, theme, {
                icon: 'info',
                title: 'Pago en proceso',
                html: d.product
                    ? '<b>' + d.product + '</b><br><small>Te notificaremos cuando se confirme.</small>'
                    : 'Tu pago está siendo verificado.',
                confirmButtonText: 'Entendido',
            }));
        }
    });
    </script>

    @stack('scripts')
</body>
</html>
