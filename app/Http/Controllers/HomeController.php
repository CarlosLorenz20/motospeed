<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $productosDestacados = Product::where('activo', true)
            ->where('destacado', true)
            ->with('category')
            ->latest()
            ->take(8)
            ->get();

        $categorias = Category::where('activa', true)->get();

        return view('home.index', compact('productosDestacados', 'categorias'));
    }
}
