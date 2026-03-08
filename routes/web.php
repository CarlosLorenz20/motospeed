<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

// ─── Públicas ───────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/servicios', [ServicesController::class, 'index'])->name('services.index');

// Tienda
Route::prefix('tienda')->name('store.')->group(function () {
    Route::get('/', [StoreController::class, 'index'])->name('index');
    Route::get('/{slug}', [StoreController::class, 'show'])->name('show');
});

// ─── Autenticación ──────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',    [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login',   [LoginController::class, 'login']);
    Route::get('/registro', [RegisterController::class, 'showRegisterForm'])->name('register');
    Route::post('/registro', [RegisterController::class, 'register'])->name('register.store');
});

Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// ─── Checkout / Mercado Pago ──────────────────────────────────────────────────
// El webhook NO requiere auth (MP lo llama desde sus servidores)
Route::post('/checkout/webhook', [MercadoPagoController::class, 'webhook'])
    ->name('checkout.webhook')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// Iniciar pago (requiere auth)
Route::post('/checkout/pagar', [MercadoPagoController::class, 'createPreference'])
    ->name('checkout.pagar')
    ->middleware('auth');

// Retornos de MP (no requieren auth, MP redirige aquí)
Route::get('/checkout/exito/{order}',      [MercadoPagoController::class, 'success'])->name('checkout.exito');
Route::get('/checkout/error/{order}',      [MercadoPagoController::class, 'failure'])->name('checkout.error');
Route::get('/checkout/pendiente/{order}',  [MercadoPagoController::class, 'pending'])->name('checkout.pendiente');


// ─── Admin (requiere auth + rol admin) ──────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminDashboard::class, 'index'])->name('dashboard');

    // CRUD Productos
    Route::resource('productos', AdminProductController::class, [
        'parameters' => ['productos' => 'product'],
        'except'     => ['show'],
    ])->names([
        'index'   => 'products.index',
        'create'  => 'products.create',
        'store'   => 'products.store',
        'edit'    => 'products.edit',
        'update'  => 'products.update',
        'destroy' => 'products.destroy',
    ]);

    Route::patch('/productos/{product}/toggle', [AdminProductController::class, 'toggleActivo'])
        ->name('products.toggle');
});

