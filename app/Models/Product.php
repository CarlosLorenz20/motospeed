<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'nombre',
        'slug',
        'descripcion',
        'precio',
        'precio_oferta',
        'stock',
        'imagen',
        'imagenes_adicionales',
        'marca',
        'modelo_compatible',
        'sku',
        'destacado',
        'activo',
    ];

    protected $casts = [
        'precio'               => 'integer',
        'precio_oferta'        => 'integer',
        'stock'                => 'integer',
        'destacado'            => 'boolean',
        'activo'               => 'boolean',
        'imagenes_adicionales' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Precio formateado en pesos chilenos.
     */
    public function getPrecioFormateadoAttribute(): string
    {
        return '$ ' . number_format($this->precio, 0, ',', '.');
    }

    public function getPrecioOfertaFormateadoAttribute(): ?string
    {
        if ($this->precio_oferta) {
            return '$ ' . number_format($this->precio_oferta, 0, ',', '.');
        }

        return null;
    }

    /**
     * Porcentaje de descuento.
     */
    public function getDescuentoPorcentajeAttribute(): ?int
    {
        if ($this->precio_oferta && $this->precio > 0) {
            return (int) round((1 - $this->precio_oferta / $this->precio) * 100);
        }

        return null;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->nombre) . '-' . Str::random(4);
            }
        });
    }
}
