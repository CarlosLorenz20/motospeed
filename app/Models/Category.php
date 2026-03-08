<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'icono',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Auto-generar slug al crear
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->nombre);
            }
        });
    }
}
