@extends('layouts.admin')
@section('title', 'Dashboard')
@section('page-title', 'Dashboard')
@section('page-subtitle', 'Resumen general de la tienda')

@section('content')

{{-- Stats cards --}}
<div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    @php
    $statIcons = [
        ['label' => 'Productos',  'value' => $stats['productos'],  'color' => 'blue',   'path' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>'],
        ['label' => 'Activos',   'value' => $stats['activos'],    'color' => 'green',  'path' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'],
        ['label' => 'Categorías', 'value' => $stats['categorias'], 'color' => 'purple', 'path' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>'],
        ['label' => 'Clientes',  'value' => $stats['clientes'],   'color' => 'indigo', 'path' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>'],
        ['label' => 'Sin Stock', 'value' => $stats['sin_stock'],  'color' => 'red',    'path' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>'],
    ];
    @endphp
    @foreach($statIcons as $stat)
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-{{ $stat['color'] }}-50 flex items-center justify-center text-{{ $stat['color'] }}-600 shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{!! $stat['path'] !!}</svg>
        </div>
        <div>
            <p class="text-2xl font-extrabold text-gray-900">{{ $stat['value'] }}</p>
            <p class="text-sm text-gray-500">{{ $stat['label'] }}</p>
        </div>
    </div>
    @endforeach
</div>

{{-- Quick actions --}}
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <a href="{{ route('admin.products.create') }}"
       class="flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl p-5 transition-colors shadow group">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        </div>
        <div>
            <p class="font-bold text-base">Nuevo Producto</p>
            <p class="text-red-200 text-sm">Agregar al catálogo</p>
        </div>
    </a>
    <a href="{{ route('admin.products.index') }}"
       class="flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 transition-colors shadow-sm group">
        <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        </div>
        <div>
            <p class="font-bold text-base text-gray-800">Ver Productos</p>
            <p class="text-gray-500 text-sm">Gestionar catálogo</p>
        </div>
    </a>
    <a href="{{ route('store.index') }}" target="_blank"
       class="flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 transition-colors shadow-sm group">
        <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <div>
            <p class="font-bold text-base text-gray-800">Ver Tienda</p>
            <p class="text-gray-500 text-sm">Vista del cliente</p>
        </div>
    </a>
</div>

{{-- Últimos productos --}}
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-800">Últimos Productos</h3>
        <a href="{{ route('admin.products.index') }}" class="text-sm text-red-600 hover:text-red-700 font-medium">Ver todos →</a>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th class="px-6 py-3 font-semibold">Producto</th>
                    <th class="px-6 py-3 font-semibold">Categoría</th>
                    <th class="px-6 py-3 font-semibold">Precio</th>
                    <th class="px-6 py-3 font-semibold">Stock</th>
                    <th class="px-6 py-3 font-semibold">Estado</th>
                    <th class="px-6 py-3 font-semibold">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @foreach($productosRecientes as $producto)
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                @if($producto->imagen)
                                    <img src="{{ asset('storage/' . $producto->imagen) }}" class="w-full h-full object-cover" alt="">
                                @else
                                    <div class="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                    </div>
                                @endif
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800 max-w-[180px] truncate">{{ $producto->nombre }}</p>
                                @if($producto->sku)<p class="text-xs text-gray-400">{{ $producto->sku }}</p>@endif
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $producto->category->nombre }}</td>
                    <td class="px-6 py-4 font-semibold text-gray-800">{{ $producto->precio_formateado }}</td>
                    <td class="px-6 py-4">
                        <span class="{{ $producto->stock > 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50' }} px-2 py-0.5 rounded-full text-xs font-semibold">
                            {{ $producto->stock }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="{{ $producto->activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500' }} px-2 py-0.5 rounded-full text-xs font-semibold">
                            {{ $producto->activo ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <a href="{{ route('admin.products.edit', $producto) }}" class="text-blue-600 hover:text-blue-700 font-medium">Editar</a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection
