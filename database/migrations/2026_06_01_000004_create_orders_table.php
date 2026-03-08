<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Relación con usuario (puede ser null si compra como invitado)
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Producto(s) — si en el futuro se expande a carrito, se puede mover a order_items
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('quantity')->default(1);

            // Mercado Pago
            $table->string('mp_preference_id')->nullable()->index(); // ID de preferencia MP
            $table->string('mp_payment_id')->nullable()->index();    // ID de pago confirmado
            $table->string('mp_merchant_order_id')->nullable();
            $table->string('mp_payment_type')->nullable();           // credit_card, account_money, etc.

            // Estado del pedido
            $table->enum('status', ['pending', 'approved', 'in_process', 'rejected', 'cancelled', 'refunded'])
                  ->default('pending');

            // Montos
            $table->unsignedBigInteger('amount');    // en centavos CLP (sin decimales)
            $table->char('currency', 3)->default('CLP');

            // Datos del comprador (snap en el momento de la compra)
            $table->string('buyer_name')->nullable();
            $table->string('buyer_email')->nullable();
            $table->string('buyer_phone')->nullable();

            // Metadata extra (JSON) — datos de envío, dirección, etc.
            $table->json('metadata')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
