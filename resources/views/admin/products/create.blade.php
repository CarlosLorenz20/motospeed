@extends('layouts.admin')
@section('title', 'Nuevo Producto')
@section('page-title', 'Nuevo Producto')
@section('page-subtitle', 'Agregar producto al catálogo')

@section('content')
<div class="max-w-3xl">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-gray-800">Información del Producto</h3>
            <a href="{{ route('admin.products.index') }}" class="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Volver
            </a>
        </div>

        <form method="POST" action="{{ route('admin.products.store') }}" enctype="multipart/form-data" class="p-6 space-y-6">
            @csrf

            @include('admin.products._form', ['producto' => null])

            <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button type="submit" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Crear Producto
                </button>
                <a href="{{ route('admin.products.index') }}" class="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                    Cancelar
                </a>
            </div>
        </form>
    </div>
</div>
@endsection
