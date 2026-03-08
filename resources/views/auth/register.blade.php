@extends('layouts.app')
@section('title', 'Crear Cuenta')

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
            <h1 class="text-2xl font-extrabold text-gray-900 mt-6">Crea tu cuenta</h1>
            <p class="text-gray-500 text-sm mt-1">Regístrate gratis y empieza a comprar</p>
        </div>

        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

            @if($errors->any())
                <div class="mb-5 bg-red-50 border border-red-200 rounded-xl p-4">
                    <ul class="space-y-1">
                        @foreach($errors->all() as $error)
                            <li class="flex items-center gap-2 text-sm text-red-700">
                                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-4a1 1 0 000 2h14a1 1 0 000-2H3z" clip-rule="evenodd"/></svg>
                                {{ $error }}
                            </li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('register.store') }}" class="space-y-5">
                @csrf

                {{-- Nombre --}}
                <div>
                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-1.5">Nombre completo</label>
                    <input type="text" id="name" name="name" value="{{ old('name') }}" required
                           placeholder="Juan Pérez"
                           class="w-full px-4 py-3 rounded-xl border {{ $errors->has('name') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                </div>

                {{-- Email --}}
                <div>
                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">Correo electrónico</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required
                           placeholder="tu@correo.cl"
                           class="w-full px-4 py-3 rounded-xl border {{ $errors->has('email') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                </div>

                {{-- Teléfono --}}
                <div>
                    <label for="telefono" class="block text-sm font-semibold text-gray-700 mb-1.5">
                        Teléfono <span class="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input type="text" id="telefono" name="telefono" value="{{ old('telefono') }}"
                           placeholder="+56 9 1234 5678"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                </div>

                {{-- Password --}}
                <div>
                    <label for="password" class="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" required
                               placeholder="Mínimo 8 caracteres"
                               class="w-full px-4 py-3 pr-12 rounded-xl border {{ $errors->has('password') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                        <button type="button" onclick="togglePassword('password', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                    </div>
                </div>

                {{-- Confirmar password --}}
                <div>
                    <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar contraseña</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" required
                           placeholder="Repite la contraseña"
                           class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                </div>

                {{-- Términos --}}
                <label class="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" required class="mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-400">
                    <span class="text-sm text-gray-600">
                        Acepto los <a href="#" class="text-red-600 hover:underline font-medium">términos y condiciones</a> y la <a href="#" class="text-red-600 hover:underline font-medium">política de privacidad</a>
                    </span>
                </label>

                <button type="submit"
                        class="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm active:scale-95 transition-all">
                    Crear Cuenta Gratis
                </button>
            </form>

            <p class="text-center text-sm text-gray-500 mt-5">
                ¿Ya tienes cuenta?
                <a href="{{ route('login') }}" class="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors">
                    Iniciar Sesión
                </a>
            </p>
        </div>
    </div>
</div>

@push('scripts')
<script>
function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
}
</script>
@endpush
@endsection
