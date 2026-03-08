<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') | Panel MotoSpeed</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body class="bg-gray-100 font-[Inter] antialiased" style="font-family: Inter, sans-serif;">

<div class="flex h-screen overflow-hidden">

    {{-- ─── Overlay (móvil) ───────────────────────────────────────────────── --}}
    <div id="sidebar-overlay" class="hidden fixed inset-0 z-20 bg-black/50 lg:hidden"></div>

    {{-- ─── SIDEBAR ─────────────────────────────────────────────────────────── --}}
    <aside id="sidebar" class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 flex flex-col shrink-0
                               -translate-x-full lg:translate-x-0 transition-transform duration-300">
        {{-- Logo --}}
        <div class="p-5 border-b border-gray-800">
            <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3">
                <div class="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow">
                    <span class="text-white font-black text-sm">MS</span>
                </div>
                <div>
                    <p class="text-white font-bold text-sm leading-tight">MotoSpeed</p>
                    <p class="text-gray-500 text-xs">Panel Admin</p>
                </div>
            </a>
        </div>

        {{-- Menú --}}
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <p class="text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 pt-2 pb-1">Principal</p>

            <a href="{{ route('admin.dashboard') }}"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors {{ request()->routeIs('admin.dashboard') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white' }}">
                <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                Dashboard
            </a>

            <p class="text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 pt-4 pb-1">Catálogo</p>

            <a href="{{ route('admin.products.index') }}"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors {{ request()->routeIs('admin.products.*') ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white' }}">
                <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                Productos
            </a>

            <p class="text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 pt-4 pb-1">Tienda</p>

            <a href="{{ route('home') }}" target="_blank"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                Ver Tienda
            </a>
        </nav>

        {{-- User info --}}
        <div class="p-4 border-t border-gray-800">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                    <span class="text-red-700 font-bold text-sm">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">{{ auth()->user()->name }}</p>
                    <p class="text-gray-500 text-xs truncate">{{ auth()->user()->email }}</p>
                </div>
            </div>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Cerrar Sesión
                </button>
            </form>
        </div>
    </aside>

    {{-- ─── MAIN ────────────────────────────────────────────────────────────── --}}
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-0">
        {{-- Topbar --}}
        <header class="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
                {{-- Hamburger móvil --}}
                <button id="sidebar-toggle" type="button"
                        class="lg:hidden p-2 -ml-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Abrir menú">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
                <div>
                    <h2 class="font-bold text-gray-800 text-sm sm:text-base">@yield('page-title', 'Dashboard')</h2>
                    <p class="text-xs text-gray-500 hidden sm:block">@yield('page-subtitle', '')</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">Admin</span>
            </div>
        </header>

        {{-- Flash messages (toast) — mismo sistema que el layout público --}}
        @php
            $toasts = array_filter([
                session('success') ? ['type'=>'success','msg'=>session('success')] : null,
                session('error')   ? ['type'=>'error',  'msg'=>session('error')]   : null,
                session('warning') ? ['type'=>'warning','msg'=>session('warning')] : null,
                session('info')    ? ['type'=>'info',   'msg'=>session('info')]    : null,
            ]);
        @endphp
        @if(count($toasts))
        <div id="toast-backdrop"
             class="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[1px] md:hidden"
             onclick="dismissAllToasts()"></div>

        <div id="toast-container"
             class="fixed z-[9999] flex flex-col gap-3
                    bottom-0 left-0 right-0 p-4 items-center
                    md:bottom-6 md:right-6 md:left-auto md:p-0 md:items-end md:max-w-xs">

            @foreach(array_values($toasts) as $i => $toast)
            @php
                $cfg = match($toast['type']) {
                    'success' => ['border'=>'border-green-400','icon_color'=>'text-green-500','bar'=>'bg-green-400',
                        'icon'=>'<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'],
                    'error'   => ['border'=>'border-red-400',  'icon_color'=>'text-red-500',  'bar'=>'bg-red-400',
                        'icon'=>'<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'],
                    'warning' => ['border'=>'border-yellow-400','icon_color'=>'text-yellow-500','bar'=>'bg-yellow-400',
                        'icon'=>'<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>'],
                    default   => ['border'=>'border-blue-400', 'icon_color'=>'text-blue-500', 'bar'=>'bg-blue-400',
                        'icon'=>'<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>'],
                };
            @endphp
            <div id="toast-{{ $i }}"
                 data-delay="{{ 4500 + $i * 600 }}"
                 role="alert"
                 class="toast-item w-full md:w-72 bg-white {{ $cfg['border'] }} border-l-4
                        rounded-xl shadow-xl overflow-hidden
                        flex items-start gap-3 p-4
                        transition-all duration-300 ease-out">
                <svg class="w-5 h-5 {{ $cfg['icon_color'] }} shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    {!! $cfg['icon'] !!}
                </svg>
                <p class="text-sm font-medium text-gray-800 flex-1 leading-snug">{{ $toast['msg'] }}</p>
                <button onclick="dismissToast(document.getElementById('toast-{{ $i }}'))"
                        class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-0.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <span class="toast-bar {{ $cfg['bar'] }} absolute bottom-0 left-0 h-0.5 w-full origin-left"
                      style="animation: toast-progress {{ (4500 + $i * 600) }}ms linear forwards;"></span>
            </div>
            @endforeach
        </div>

        <style>
            @keyframes toast-progress { from{transform:scaleX(1)} to{transform:scaleX(0)} }
            .toast-item{position:relative}
            .toast-hiding{opacity:0!important;transform:translateY(.5rem)!important;pointer-events:none}
            @media(min-width:768px){.toast-hiding{transform:translateX(110%)!important}}
        </style>
        <script>
            function dismissToast(el){if(!el)return;el.classList.add('toast-hiding');setTimeout(()=>{el.remove();cleanupToasts()},300)}
            function dismissAllToasts(){document.querySelectorAll('.toast-item').forEach(dismissToast)}
            function cleanupToasts(){const c=document.getElementById('toast-container'),b=document.getElementById('toast-backdrop');if(c&&!c.querySelector('.toast-item')){c.remove();if(b)b.remove()}}
            document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.toast-item[data-delay]').forEach(function(el){setTimeout(function(){dismissToast(el)},parseInt(el.getAttribute('data-delay'),10))})});
        </script>
        @endif

        {{-- Content --}}
        <main class="flex-1 overflow-y-auto p-4 sm:p-6">
            @yield('content')
        </main>
    </div>
</div>

@stack('scripts')
</body>
</html>
