{{-- Componente: Tarjeta de Producto
    @props: $producto (App\Models\Product)
--}}
<div class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">

    {{-- Imagen --}}
    <a href="{{ route('store.show', $producto->slug) }}" class="block relative overflow-hidden bg-gray-50 aspect-square">
        @if($producto->imagen)
            <img src="{{ asset('storage/' . $producto->imagen) }}"
                 alt="{{ $producto->nombre }}"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        @else
            <div class="w-full h-full flex flex-col items-center justify-center text-gray-300 p-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs font-medium text-gray-400">Sin imagen</span>
            </div>
        @endif

        {{-- Badges --}}
        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
            @if($producto->precio_oferta)
                <span class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    -{{ $producto->descuento_porcentaje }}%
                </span>
            @endif
            @if($producto->destacado)
                <span class="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    Destacado
                </span>
            @endif
            @if($producto->stock === 0)
                <span class="bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    Agotado
                </span>
            @endif
        </div>
    </a>

    {{-- Contenido --}}
    <div class="p-4 flex flex-col gap-2 flex-1">
        {{-- Categoría --}}
        <span class="text-xs font-medium text-red-500 uppercase tracking-wider flex items-center gap-1">
            <x-category-icon :slug="$producto->category->slug" class="w-3.5 h-3.5" />
            {{ $producto->category->nombre }}
        </span>

        {{-- Nombre --}}
        <a href="{{ route('store.show', $producto->slug) }}"
           class="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-red-600 transition-colors leading-snug">
            {{ $producto->nombre }}
        </a>

        {{-- Marca / modelo --}}
        @if($producto->marca || $producto->modelo_compatible)
            <p class="text-xs text-gray-400 truncate">
                @if($producto->marca)<span class="font-medium text-gray-500">{{ $producto->marca }}</span>@endif
                @if($producto->marca && $producto->modelo_compatible) · @endif
                {{ $producto->modelo_compatible }}
            </p>
        @endif

        {{-- Precio --}}
        <div class="mt-auto pt-2 flex flex-col">
            @if($producto->precio_oferta)
                <span class="text-xs text-gray-400 line-through">{{ $producto->precio_formateado }}</span>
                <span class="text-xl font-extrabold text-red-600">{{ $producto->precio_oferta_formateado }}</span>
            @else
                <span class="text-xl font-extrabold text-gray-900">{{ $producto->precio_formateado }}</span>
            @endif
            <span class="text-xs text-gray-400 mt-0.5">IVA incluido</span>
        </div>

        {{-- CTA --}}
        <a href="{{ route('store.show', $producto->slug) }}"
           class="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all
                  {{ $producto->stock > 0
                    ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed' }}">
            @if($producto->stock > 0)
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Ver Detalle
            @else
                Sin Stock
            @endif
        </a>
    </div>
</div>
