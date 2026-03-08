<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('activo', true)->with('category');

        // Filtro por categoría
        if ($request->filled('categoria')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->categoria));
        }

        // Búsqueda por nombre
        if ($request->filled('buscar')) {
            $query->where(function ($q) use ($request) {
                $q->where('nombre', 'like', '%' . $request->buscar . '%')
                  ->orWhere('marca', 'like', '%' . $request->buscar . '%')
                  ->orWhere('modelo_compatible', 'like', '%' . $request->buscar . '%');
            });
        }

        // Filtro precio
        if ($request->filled('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }

        // Ordenar
        match ($request->get('orden', 'recientes')) {
            'precio_asc'  => $query->orderBy('precio', 'asc'),
            'precio_desc' => $query->orderBy('precio', 'desc'),
            'nombre'      => $query->orderBy('nombre', 'asc'),
            default       => $query->latest(),
        };

        $productos  = $query->paginate(12)->withQueryString();
        $categorias = Category::where('activa', true)->withCount(['products' => fn($q) => $q->where('activo', true)])->get();

        return view('store.index', compact('productos', 'categorias'));
    }

    public function show(string $slug)
    {
        $producto = Product::where('slug', $slug)
            ->where('activo', true)
            ->with('category')
            ->firstOrFail();

        $relacionados = Product::where('activo', true)
            ->where('category_id', $producto->category_id)
            ->where('id', '!=', $producto->id)
            ->take(4)
            ->get();

        return view('store.show', compact('producto', 'relacionados'));
    }
}
