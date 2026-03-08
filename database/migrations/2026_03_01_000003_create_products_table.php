<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('nombre');
            $table->string('slug')->unique();
            $table->text('descripcion');
            $table->decimal('precio', 10, 0);          // Pesos chilenos, sin decimales
            $table->decimal('precio_oferta', 10, 0)->nullable();
            $table->integer('stock')->default(0);
            $table->string('imagen')->nullable();
            $table->json('imagenes_adicionales')->nullable();
            $table->string('marca')->nullable();
            $table->string('modelo_compatible')->nullable(); // Ej: Honda CBR 150
            $table->string('sku')->unique()->nullable();
            $table->boolean('destacado')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
