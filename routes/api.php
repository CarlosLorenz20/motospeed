<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — JWT Authentication
|--------------------------------------------------------------------------
|
| Estas rutas son para consumo de APIs externas (apps móviles, integraciones).
| La autenticación usa JWT a través del guard 'api'.
|
| Prefijo base: /api
|
*/

// ─── Auth pública ────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:10,1')   // max 10 intentos por minuto
        ->name('api.auth.login');
});

// ─── Auth protegida (requiere JWT válido) ─────────────────────────────────────
Route::middleware('auth:api')->prefix('auth')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout'])->name('api.auth.logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('api.auth.refresh');
    Route::get('/me',       [AuthController::class, 'me'])->name('api.auth.me');
});

// ─── Recursos públicos ────────────────────────────────────────────────────────
Route::prefix('v1')->group(function () {

    // Productos: lectura pública (catálogo)
    Route::get('/productos', function (Request $request) {
        $products = \App\Models\Product::query()
            ->where('activo', true)
            ->when($request->categoria_id, fn ($q, $id) => $q->where('categoria_id', $id))
            ->when($request->q, fn ($q, $search) => $q->where('nombre', 'like', "%{$search}%"))
            ->with('categoria:id,nombre,slug')
            ->select(['id', 'nombre', 'slug', 'precio', 'precio_oferta', 'imagen', 'categoria_id'])
            ->orderBy('nombre')
            ->paginate(20);

        return response()->json($products);
    })->name('api.productos.index');

    Route::get('/productos/{slug}', function (string $slug) {
        $product = \App\Models\Product::where('slug', $slug)
            ->where('activo', true)
            ->with('categoria:id,nombre,slug')
            ->firstOrFail();

        return response()->json($product);
    })->name('api.productos.show');

    // Categorías
    Route::get('/categorias', function () {
        $cats = \App\Models\Category::select(['id', 'nombre', 'slug'])
            ->withCount(['products' => fn ($q) => $q->where('activo', true)])
            ->orderBy('nombre')
            ->get();

        return response()->json($cats);
    })->name('api.categorias.index');
});
