<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'productos'  => Product::count(),
            'activos'    => Product::where('activo', true)->count(),
            'categorias' => Category::count(),
            'clientes'   => User::where('role', 'cliente')->count(),
            'sin_stock'  => Product::where('stock', 0)->count(),
        ];

        $productosRecientes = Product::with('category')->latest()->take(5)->get();

        return view('admin.dashboard', compact('stats', 'productosRecientes'));
    }
}
