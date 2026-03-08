<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'mp_preference_id',
        'mp_payment_id',
        'mp_merchant_order_id',
        'mp_payment_type',
        'status',
        'amount',
        'currency',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'amount'   => 'integer',
    ];

    // ─── Relaciones ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /** Monto en formato legible (CLP sin decimales) */
    public function getFormattedAmountAttribute(): string
    {
        return '$' . number_format($this->amount, 0, ',', '.');
    }

    public function isPending(): bool   { return $this->status === 'pending'; }
    public function isApproved(): bool  { return $this->status === 'approved'; }
    public function isRejected(): bool  { return $this->status === 'rejected'; }
}
