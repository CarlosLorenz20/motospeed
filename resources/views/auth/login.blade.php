@extends('layouts.app')
@section('title', 'Iniciar Sesión')

@section('content')
<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
    <div class="w-full max-w-md">

        {{-- Logo --}}
        <div class="text-center mb-8">
            <a href="{{ route('home') }}" class="inline-flex items-center gap-3 justify-center">
                <div class="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span class="text-white font-black text-base">MS</span>
                </div>
                <div class="text-left">
                    <p class="font-extrabold text-gray-900 text-lg leading-tight">MotoSpeed</p>
                    <p class="text-xs text-gray-500">Motos y Repuestos Speed</p>
                </div>
            </a>
            <h1 class="text-2xl font-extrabold text-gray-900 mt-6">Bienvenido de vuelta</h1>
            <p class="text-gray-500 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
        </div>

        {{-- Tarjeta --}}
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

            @if($errors->any())
                <div class="mb-5 bg-red-50 border border-red-200 rounded-xl p-4">
                    <ul class="space-y-1">
                        @foreach($errors->all() as $error)
                            <li class="flex items-center gap-2 text-sm text-red-700">
                                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                                {{ $error }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}" class="space-y-5">
                @csrf

                {{-- Email --}}
                <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus
                           placeholder="tu@correo.cl"
                           class="w-full px-4 py-3 rounded-xl border {{ $errors->has('email') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                </div>

                {{-- Password --}}
                <div>
                    <label for="password" class="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" required
                               placeholder="••••••••"
                               class="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                        <button type="button" onclick="togglePassword('password', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                    </div>
                </div>

                {{-- Remember --}}
                <div class="flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" class="rounded border-gray-300 text-red-600 focus:ring-red-400">
                        <span class="text-sm text-gray-600">Recordarme</span>
                    </label>
                </div>

                {{-- Submit --}}
                <button type="submit"
                        class="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm active:scale-95 transition-all">
                    Iniciar Sesión
                </button>
            </form>

            {{-- Credenciales de prueba --}}
            <div class="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p class="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                    Credenciales de prueba:
                </p>
                <div class="grid grid-cols-2 gap-2 text-xs text-amber-700">
                    <div class="bg-white rounded-lg p-2 border border-amber-100">
                        <p class="font-semibold">Admin</p>
                        <p>admin@motosyrepuestosspeed.cl</p>
                        <p>admin123</p>
                    </div>
                    <div class="bg-white rounded-lg p-2 border border-amber-100">
                        <p class="font-semibold">Cliente</p>
                        <p>cliente@test.cl</p>
                        <p>cliente123</p>
                    </div>
                </div>
            </div>

            <p class="text-center text-sm text-gray-500 mt-5">
                ¿No tienes cuenta?
                <a href="{{ route('register') }}" class="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors">
                    Regístrate gratis
                </a>
            </p>
        </div>
    </div>
</div>

@push('scripts')
<script>
function togglePassword(id, btn) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}
</script>
@endpush
@endsection
