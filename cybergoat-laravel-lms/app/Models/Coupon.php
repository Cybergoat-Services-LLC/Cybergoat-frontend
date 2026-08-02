<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'discount_value',
        'max_uses',
        'uses_count',
        'expires_at',
    ];

    protected $casts = [
        'discount_value' => 'float',
        'max_uses' => 'integer',
        'uses_count' => 'integer',
        'expires_at' => 'datetime',
    ];

    public function isValid(): bool
    {
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return $this->uses_count < $this->max_uses;
    }

    public function discountFor(float $subtotal): float
    {
        $discount = $this->type === 'percentage'
            ? $subtotal * ($this->discount_value / 100)
            : $this->discount_value;

        // Never discount below zero, and never past the subtotal itself.
        return round(min($discount, $subtotal), 2);
    }

    /**
     * Increment usage atomically so concurrent redemptions can't both slip
     * past the max_uses check between read and write.
     */
    public function redeem(): void
    {
        static::where('id', $this->id)->increment('uses_count');
        $this->refresh();
    }
}
