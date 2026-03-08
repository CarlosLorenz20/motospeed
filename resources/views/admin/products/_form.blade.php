{{-- Partial: _form.blade.php  (usado en create y edit) --}}
@if($errors->any())
<div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
    <ul class="space-y-1">
        @foreach($errors->all() as $err)
            <li class="text-sm text-red-700 flex items-center gap-2">
                <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                {{ $err }}
            </li>
        @endforeach
    </ul>
</div>
@endif

{{-- Grid 2 columnas --}}
<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

    {{-- Nombre --}}
    <div class="sm:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del producto <span class="text-red-500">*</span></label>
        <input type="text" name="nombre" value="{{ old('nombre', $producto?->nombre) }}" required
               placeholder="Ej: Kit de Pistón Honda CB125"
               class="w-full px-4 py-2.5 rounded-xl border {{ $errors->has('nombre') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition">
    </div>

    {{-- Categoría --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Categoría <span class="text-red-500">*</span></label>
        <select name="category_id" required
                class="w-full px-4 py-2.5 rounded-xl border {{ $errors->has('category_id') ? 'border-red-400' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white">
            <option value="">Seleccionar...</option>
            @foreach($categorias as $cat)
                <option value="{{ $cat->id }}" {{ old('category_id', $producto?->category_id) == $cat->id ? 'selected' : '' }}>
                    {{ $cat->icono }} {{ $cat->nombre }}
                </option>
            @endforeach
        </select>
    </div>

    {{-- SKU --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">SKU</label>
        <input type="text" name="sku" value="{{ old('sku', $producto?->sku) }}"
               placeholder="Ej: KIT-PIST-CB125"
               class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition uppercase">
    </div>

    {{-- Precio --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Precio (CLP) <span class="text-red-500">*</span></label>
        <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
            <input type="number" name="precio" value="{{ old('precio', $producto?->precio) }}" required min="1"
                   placeholder="29990"
                   class="w-full pl-8 pr-4 py-2.5 rounded-xl border {{ $errors->has('precio') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition">
        </div>
    </div>

    {{-- Precio oferta --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Precio de Oferta (CLP)</label>
        <div class="relative">
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
            <input type="number" name="precio_oferta" value="{{ old('precio_oferta', $producto?->precio_oferta) }}" min="0"
                   placeholder="Dejar vacío si no aplica"
                   class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition">
        </div>
        <p class="text-xs text-gray-400 mt-1">Debe ser menor al precio original</p>
    </div>

    {{-- Stock --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Stock <span class="text-red-500">*</span></label>
        <input type="number" name="stock" value="{{ old('stock', $producto?->stock ?? 0) }}" required min="0"
               class="w-full px-4 py-2.5 rounded-xl border {{ $errors->has('stock') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition">
    </div>

    {{-- Marca --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Marca</label>
        <input type="text" name="marca" value="{{ old('marca', $producto?->marca) }}"
               placeholder="Ej: Honda, Yamaha, Pirelli..."
               class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition">
    </div>

    {{-- Modelo compatible --}}
    <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Modelo compatible</label>
        <input type="text" name="modelo_compatible" value="{{ old('modelo_compatible', $producto?->modelo_compatible) }}"
               placeholder="Ej: Honda CB125 / CB150"
               class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition">
    </div>

    {{-- Descripción --}}
    <div class="sm:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Descripción <span class="text-red-500">*</span></label>
        <textarea name="descripcion" rows="4" required
                  placeholder="Describe el producto en detalle..."
                  class="w-full px-4 py-2.5 rounded-xl border {{ $errors->has('descripcion') ? 'border-red-400 bg-red-50' : 'border-gray-200' }} text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition resize-none">{{ old('descripcion', $producto?->descripcion) }}</textarea>
    </div>

    {{-- Imagen --}}
    <div class="sm:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-1.5">Imagen del producto</label>

        @if($producto?->imagen)
            <div class="mb-3 flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img src="{{ asset('storage/' . $producto->imagen) }}" class="w-16 h-16 object-cover rounded-lg border border-gray-200" alt="">
                <div>
                    <p class="text-sm text-gray-700 font-medium">Imagen actual</p>
                    <p class="text-xs text-gray-400">Sube una nueva imagen para reemplazarla</p>
                </div>
            </div>
        @endif

        <div class="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors cursor-pointer"
             onclick="document.getElementById('imagen-input').click()">
            <input type="file" id="imagen-input" name="imagen" accept="image/*" class="sr-only"
                   onchange="previewImage(this)">
            <div id="image-preview" class="hidden mb-3">
                <img id="preview-img" src="" alt="Preview" class="w-24 h-24 object-cover rounded-lg mx-auto border border-gray-200">
            </div>
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-sm font-medium text-gray-600">Haz clic para subir imagen</p>
            <p class="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Máx. 2MB</p>
        </div>
    </div>

    {{-- Checkboxes --}}
    <div class="sm:col-span-2 flex flex-wrap gap-6">
        <label class="flex items-center gap-2.5 cursor-pointer">
            <input type="hidden" name="destacado" value="0">
            <input type="checkbox" name="destacado" value="1" {{ old('destacado', $producto?->destacado) ? 'checked' : '' }}
                   class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-400">
            <span class="text-sm font-medium text-gray-700">⭐ Marcar como destacado</span>
        </label>
        <label class="flex items-center gap-2.5 cursor-pointer">
            <input type="hidden" name="activo" value="0">
            <input type="checkbox" name="activo" value="1" {{ old('activo', $producto?->activo ?? true) ? 'checked' : '' }}
                   class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-400">
            <span class="text-sm font-medium text-gray-700">✅ Producto activo (visible en tienda)</span>
        </label>
    </div>
</div>

@push('scripts')
<script>
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('image-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
@endpush
