<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Administrador Speed',
            'email'    => 'admin@motosyrepuestosspeed.cl',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
        ]);

        // Cliente de prueba
        User::create([
            'name'     => 'Cliente Prueba',
            'email'    => 'cliente@test.cl',
            'password' => Hash::make('cliente123'),
            'role'     => 'cliente',
        ]);

        // Categorías
        $categorias = [
            ['nombre' => 'Motos',               'slug' => 'motos',              'icono' => 'motos'],
            ['nombre' => 'Repuestos Motor',     'slug' => 'repuestos-motor',    'icono' => 'repuestos-motor'],
            ['nombre' => 'Frenos y Suspensión', 'slug' => 'frenos-suspension',  'icono' => 'frenos-suspension'],
            ['nombre' => 'Eléctrico',           'slug' => 'electrico',          'icono' => 'electrico'],
            ['nombre' => 'Accesorios',          'slug' => 'accesorios',         'icono' => 'accesorios'],
            ['nombre' => 'Cascos y Seguridad',  'slug' => 'cascos-seguridad',   'icono' => 'cascos-seguridad'],
            ['nombre' => 'Lubricantes',         'slug' => 'lubricantes',        'icono' => 'lubricantes'],
            ['nombre' => 'Neumáticos',          'slug' => 'neumaticos',         'icono' => 'neumaticos'],
        ];

        foreach ($categorias as $cat) {
            Category::create($cat);
        }

        // Productos de muestra
        $productos = [
            [
                'category_id'       => 2,
                'nombre'            => 'Kit de Pistón Honda CB125',
                'descripcion'       => 'Kit completo de pistón para Honda CB125. Incluye pistón, segmentos y pasador. Fabricado en aluminio de alta resistencia.',
                'precio'            => 29990,
                'precio_oferta'     => 24990,
                'stock'             => 15,
                'marca'             => 'Honda',
                'modelo_compatible' => 'Honda CB125 / CB150',
                'sku'               => 'KIT-PIST-CB125',
                'destacado'         => true,
                'activo'            => true,
            ],
            [
                'category_id'       => 3,
                'nombre'            => 'Pastillas de Freno Yamaha FZ',
                'descripcion'       => 'Pastillas de freno delanteras para Yamaha FZ. Material orgánico de alta fricción.',
                'precio'            => 12500,
                'stock'             => 30,
                'marca'             => 'Yamaha',
                'modelo_compatible' => 'Yamaha FZ150 / FZ16',
                'sku'               => 'PAST-FRENO-FZ',
                'destacado'         => true,
                'activo'            => true,
            ],
            [
                'category_id'       => 8,
                'nombre'            => 'Neumático Pirelli MT60 2.75-18',
                'descripcion'       => 'Neumático Pirelli MT60 para enduro y trail. Diseño mixto asfalto-tierra. Medida 2.75-18.',
                'precio'            => 45000,
                'stock'             => 8,
                'marca'             => 'Pirelli',
                'modelo_compatible' => 'Universal 18"',
                'sku'               => 'NEU-PIR-MT60-18',
                'destacado'         => true,
                'activo'            => true,
            ],
            [
                'category_id'       => 6,
                'nombre'            => 'Casco Integral LS2 FF320',
                'descripcion'       => 'Casco integral LS2 Stream EVO. Policarbonato ABS, ventilación optimizada. Certificación ECE 22.05.',
                'precio'            => 89990,
                'precio_oferta'     => 79990,
                'stock'             => 5,
                'marca'             => 'LS2',
                'modelo_compatible' => 'Universal',
                'sku'               => 'CASCO-LS2-FF320',
                'destacado'         => true,
                'activo'            => true,
            ],
            [
                'category_id'       => 7,
                'nombre'            => 'Aceite Motor Motul 10W-40 1L',
                'descripcion'       => 'Aceite semi-sintético Motul para motos 4T. Protección superior ante el desgaste. Apto para climas templados y cálidos.',
                'precio'            => 8990,
                'stock'             => 50,
                'marca'             => 'Motul',
                'modelo_compatible' => 'Universal 4T',
                'sku'               => 'ACE-MOTUL-10W40',
                'destacado'         => false,
                'activo'            => true,
            ],
        ];

        foreach ($productos as $prod) {
            Product::create($prod);
        }
    }
}
