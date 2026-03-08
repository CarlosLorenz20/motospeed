@extends('layouts.admin')
@section('title', 'Editar: ' . $product->nombre)
@section('page-title', 'Editar Producto')
@section('page-subtitle', $product->nombre)

@section('content')
<div class="max-w-3xl">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
                @if($product->imagen)
                    <img src="{{ asset('storage/' . $product->imagen) }}" class="w-10 h-10 rounded-xl object-cover border border-gray-100">
                @endif
                <div>
                    <h3 class="font-bold text-gray-800">Editando: <span class="text-red-600">{{ $product->nombre }}</span></h3>
                    <p class="text-xs text-gray-400">SKU: {{ $product->sku ?? 'Sin SKU' }}</p>
                </div>
            </div>
            <a href="{{ route('admin.products.index') }}" class="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Volver
            </a>
        </div>

        <form method="POST" action="{{ route('admin.products.update', $product) }}" enctype="multipart/form-data" class="p-6 space-y-6">
            @csrf
            @method('PUT')

            @include('admin.products._form', ['producto' => $product])

            <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button type="submit" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Guardar Cambios
                </button>
                <a href="{{ route('store.show', $product->slug) }}" target="_blank"
                   class="px-5 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Ver en Tienda
                </a>
            </div>
        </form>

        {{-- Formulario de eliminar FUERA del formulario principal --}}
        <div class="px-6 pb-6">
            <form method="POST" action="{{ route('admin.products.destroy', $product) }}"
                  onsubmit="return confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')">
                @csrf
                @method('DELETE')
                <button type="submit" class="px-5 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl transition-colors flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Eliminar Producto
                </button>
            </form>
        </div>
    </div>
</div>
@endsection
