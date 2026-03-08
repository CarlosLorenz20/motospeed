<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('buscar')) {
            $query->where('nombre', 'like', '%' . $request->buscar . '%')
                  ->orWhere('sku', 'like', '%' . $request->buscar . '%');
        }

        if ($request->filled('categoria')) {
            $query->where('category_id', $request->categoria);
        }

        $productos  = $query->latest()->paginate(15)->withQueryString();
        $categorias = Category::all();

        return view('admin.products.index', compact('productos', 'categorias'));
    }

    public function create()
    {
        $categorias = Category::where('activa', true)->get();
        return view('admin.products.create', compact('categorias'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'            => ['required', 'string', 'max:255'],
            'category_id'       => ['required', 'exists:categories,id'],
            'descripcion'       => ['required', 'string'],
            'precio'            => ['required', 'integer', 'min:1'],
            'precio_oferta'     => ['nullable', 'integer', 'lt:precio'],
            'stock'             => ['required', 'integer', 'min:0'],
            'marca'             => ['nullable', 'string', 'max:100'],
            'modelo_compatible' => ['nullable', 'string', 'max:255'],
            'sku'               => ['nullable', 'string', 'max:100', 'unique:products,sku'],
            'destacado'         => ['boolean'],
            'activo'            => ['boolean'],
            'imagen'            => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('products', 'public');
        }

        $data['slug']      = Str::slug($data['nombre']) . '-' . Str::random(4);
        $data['destacado'] = $request->boolean('destacado');
        $data['activo']    = $request->boolean('activo', true);

        Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto "' . $data['nombre'] . '" creado correctamente.');
    }

    public function edit(Product $product)
    {
        $categorias = Category::where('activa', true)->get();
        return view('admin.products.edit', compact('product', 'categorias'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'nombre'            => ['required', 'string', 'max:255'],
            'category_id'       => ['required', 'exists:categories,id'],
            'descripcion'       => ['required', 'string'],
            'precio'            => ['required', 'integer', 'min:1'],
            'precio_oferta'     => ['nullable', 'integer'],
            'stock'             => ['required', 'integer', 'min:0'],
            'marca'             => ['nullable', 'string', 'max:100'],
            'modelo_compatible' => ['nullable', 'string', 'max:255'],
            'sku'               => ['nullable', 'string', 'max:100', 'unique:products,sku,' . $product->id],
            'destacado'         => ['boolean'],
            'activo'            => ['boolean'],
            'imagen'            => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior
            if ($product->imagen) {
                Storage::disk('public')->delete($product->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('products', 'public');
        }

        $data['destacado'] = $request->boolean('destacado');
        $data['activo']    = $request->boolean('activo');

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Product $product)
    {
        if ($product->imagen) {
            Storage::disk('public')->delete($product->imagen);
        }

        $nombre = $product->nombre;
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Producto "' . $nombre . '" eliminado.');
    }

    public function toggleActivo(Product $product)
    {
        $product->update(['activo' => ! $product->activo]);

        return back()->with('success', 'Estado del producto actualizado.');
    }
}
