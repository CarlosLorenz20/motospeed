@extends('layouts.admin')
@section('title', 'Productos')
@section('page-title', 'Gestión de Productos')
@section('page-subtitle', 'Administra el catálogo de la tienda')

@section('content')

{{-- Header acciones --}}
<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <form method="GET" action="{{ route('admin.products.index') }}" class="flex flex-wrap gap-3">
        <input type="text" name="buscar" value="{{ request('buscar') }}" placeholder="Buscar por nombre o SKU..."
               class="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 w-64 bg-white">
        <select name="categoria" onchange="this.form.submit()" class="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 bg-white">
            <option value="">Todas las categorías</option>
            @foreach($categorias as $cat)
                <option value="{{ $cat->id }}" {{ request('categoria') == $cat->id ? 'selected' : '' }}>{{ $cat->nombre }}</option>
            @endforeach
        </select>
        <button type="submit" class="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors">
            Buscar
        </button>
        @if(request()->hasAny(['buscar', 'categoria']))
            <a href="{{ route('admin.products.index') }}" class="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Limpiar
            </a>
        @endif
    </form>

    <a href="{{ route('admin.products.create') }}"
       class="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm shrink-0">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nuevo Producto
    </a>
</div>

{{-- Tabla --}}
<div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    @if($productos->count())
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
                <tr class="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th class="px-5 py-3.5 font-semibold">Producto</th>
                    <th class="px-5 py-3.5 font-semibold">Categoría</th>
                    <th class="px-5 py-3.5 font-semibold">Precio</th>
                    <th class="px-5 py-3.5 font-semibold">Oferta</th>
                    <th class="px-5 py-3.5 font-semibold">Stock</th>
                    <th class="px-5 py-3.5 font-semibold">Destacado</th>
                    <th class="px-5 py-3.5 font-semibold">Estado</th>
                    <th class="px-5 py-3.5 font-semibold text-right">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
                @foreach($productos as $producto)
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                @if($producto->imagen)
                                    <img src="{{ asset('storage/' . $producto->imagen) }}" class="w-full h-full object-cover" alt="">
                                @else
                                    <div class="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                                    </div>
                                @endif
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800 max-w-[200px] truncate">{{ $producto->nombre }}</p>
                                <p class="text-xs text-gray-400">{{ $producto->sku ?? 'Sin SKU' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-5 py-4 text-gray-600 whitespace-nowrap">
                        <span class="flex items-center gap-1.5">
                            <x-category-icon :slug="$producto->category->slug" class="w-4 h-4 text-gray-400" />
                            {{ $producto->category->nombre }}
                        </span>
                    </td>
                    <td class="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{{ $producto->precio_formateado }}</td>
                    <td class="px-5 py-4 whitespace-nowrap">
                        @if($producto->precio_oferta)
                            <span class="text-red-600 font-semibold">{{ $producto->precio_oferta_formateado }}</span>
                            <span class="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full ml-1">-{{ $producto->descuento_porcentaje }}%</span>
                        @else
                            <span class="text-gray-400">—</span>
                        @endif
                    </td>
                    <td class="px-5 py-4">
                        <span class="{{ $producto->stock > 5 ? 'bg-green-100 text-green-700' : ($producto->stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700') }} px-2.5 py-1 rounded-full text-xs font-bold">
                            {{ $producto->stock }}
                        </span>
                    </td>
                    <td class="px-5 py-4">
                        @if($producto->destacado)
                            <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" title="Destacado"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        @else
                            <svg class="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        @endif
                    </td>
                    <td class="px-5 py-4">
                        <form method="POST" action="{{ route('admin.products.toggle', $producto) }}" class="inline">
                            @csrf @method('PATCH')
                            <button type="submit"
                                    class="{{ $producto->activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200' }} px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer">
                                {{ $producto->activo ? 'Activo' : 'Inactivo' }}
                            </button>
                        </form>
                    </td>
                    <td class="px-5 py-4">
                        <div class="flex items-center justify-end gap-2">
                            <a href="{{ route('store.show', $producto->slug) }}" target="_blank"
                               class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Ver en tienda">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                            <a href="{{ route('admin.products.edit', $producto) }}"
                               class="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </a>
                            <form method="POST" action="{{ route('admin.products.destroy', $producto) }}"
                                  onsubmit="return confirm('¿Eliminar el producto {{ addslashes($producto->nombre) }}? Esta acción no se puede deshacer.')">
                                @csrf @method('DELETE')
                                <button type="submit" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    {{-- Paginación --}}
    @if($productos->hasPages())
    <div class="px-6 py-4 border-t border-gray-100">
        {{ $productos->links() }}
    </div>
    @endif

    @else
    <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">No hay productos</h3>
        <p class="text-gray-500 mb-5">Empieza agregando tu primer producto al catálogo</p>
        <a href="{{ route('admin.products.create') }}" class="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors">
            Crear primer producto
        </a>
    </div>
    @endif
</div>

@endsection
