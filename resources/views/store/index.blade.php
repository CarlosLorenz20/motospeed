@extends('layouts.app')
@section('title', 'Tienda')
@section('description', 'Explora nuestro catálogo de motos, repuestos y accesorios.')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    {{-- Header + buscador --}}
    <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Nuestra Tienda</h1>
        <p class="text-gray-500">{{ $productos->total() }} producto(s) encontrado(s)</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">

        {{-- ─── SIDEBAR Filtros ─────────────────────────────────────────────── --}}
        <aside class="lg:w-64 shrink-0">
            <form method="GET" action="{{ route('store.index') }}" id="filter-form">
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6 sticky top-20">

                    {{-- Búsqueda --}}
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Buscar</label>
                        <div class="relative">
                            <input type="text" name="buscar" value="{{ request('buscar') }}"
                                   placeholder="Nombre, marca, modelo..."
                                   class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                    </div>

                    {{-- Categorías --}}
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Categoría</label>
                        <div class="space-y-1">
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input type="radio" name="categoria" value="" {{ !request('categoria') ? 'checked' : '' }}
                                       class="text-red-600 focus:ring-red-400" onchange="this.form.submit()">
                                <span class="text-sm text-gray-700 group-hover:text-red-600 transition-colors">Todas</span>
                            </label>
                            @foreach($categorias as $cat)
                            <label class="flex items-center justify-between cursor-pointer group">
                                <div class="flex items-center gap-2">
                                    <input type="radio" name="categoria" value="{{ $cat->slug }}"
                                           {{ request('categoria') === $cat->slug ? 'checked' : '' }}
                                           class="text-red-600 focus:ring-red-400" onchange="this.form.submit()">
                                    <span class="flex items-center gap-1.5 text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                                        <x-category-icon :slug="$cat->slug" class="w-4 h-4 shrink-0" />
                                        {{ $cat->nombre }}
                                    </span>
                                </div>
                                <span class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{{ $cat->products_count }}</span>
                            </label>
                            @endforeach
                        </div>
                    </div>

                    {{-- Precio máximo --}}
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Precio máximo: <span id="precio-label" class="text-red-600">$ {{ number_format(request('precio_max', 200000), 0, ',', '.') }}</span>
                        </label>
                        <input type="range" name="precio_max" id="precio-range"
                               min="1000" max="500000" step="1000"
                               value="{{ request('precio_max', 200000) }}"
                               class="w-full accent-red-600 cursor-pointer"
                               oninput="document.getElementById('precio-label').textContent = '$ ' + new Intl.NumberFormat('es-CL').format(this.value)">
                        <div class="flex justify-between text-xs text-gray-400 mt-1">
                            <span>$ 1.000</span><span>$ 500.000</span>
                        </div>
                    </div>

                    {{-- Ordenar --}}
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ordenar por</label>
                        <select name="orden" onchange="this.form.submit()" class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white">
                            <option value="recientes"  {{ request('orden', 'recientes') === 'recientes'  ? 'selected' : '' }}>Más recientes</option>
                            <option value="precio_asc" {{ request('orden') === 'precio_asc'  ? 'selected' : '' }}>Precio: menor a mayor</option>
                            <option value="precio_desc"{{ request('orden') === 'precio_desc' ? 'selected' : '' }}>Precio: mayor a menor</option>
                            <option value="nombre"     {{ request('orden') === 'nombre'      ? 'selected' : '' }}>Nombre A-Z</option>
                        </select>
                    </div>

                    {{-- Botones --}}
                    <div class="flex gap-2 pt-2">
                        <button type="submit" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
                            Filtrar
                        </button>
                        <a href="{{ route('store.index') }}" class="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl text-center transition-colors">
                            Limpiar
                        </a>
                    </div>
                </div>
            </form>
        </aside>

        {{-- ─── GRID Productos ──────────────────────────────────────────────── --}}
        <div class="flex-1 min-w-0">
            @if($productos->count())
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    @foreach($productos as $producto)
                        <x-product-card :producto="$producto"/>
                    @endforeach
                </div>

                {{-- Paginación --}}
                @if($productos->hasPages())
                <div class="mt-10 flex justify-center">
                    {{ $productos->links() }}
                </div>
                @endif
            @else
                <div class="flex flex-col items-center justify-center py-24 text-center">
                    <div class="w-16 h-16 text-gray-300 mb-4">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">No encontramos productos</h3>
                    <p class="text-gray-500 mb-6">Intenta con otros filtros o términos de búsqueda</p>
                    <a href="{{ route('store.index') }}" class="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
                        Ver todos los productos
                    </a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
