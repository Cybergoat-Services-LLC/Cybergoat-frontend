<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();

        return $setting?->value ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public static function vatEnabled(): bool
    {
        return static::get('vat_enabled', 'false') === 'true';
    }

    public static function vatRate(): float
    {
        return (float) static::get('vat_rate', '5');
    }

    public static function companyTrn(): ?string
    {
        return static::get('company_trn');
    }

    /**
     * Payment instructions shown at offline checkout (bank transfer / Aani QR).
     */
    public static function offlinePaymentInstructions(string $method): array
    {
        if ($method === 'aani_qr') {
            return [
                'aani_proxy_id' => static::get('aani_proxy_id', ''),
                'aani_qr_image_url' => static::get('aani_qr_image_url', ''),
            ];
        }

        return [
            'bank_account_name' => static::get('bank_account_name', ''),
            'bank_iban' => static::get('bank_iban', ''),
            'bank_name' => static::get('bank_name', ''),
            'bank_swift' => static::get('bank_swift', ''),
            'bank_account_number' => static::get('bank_account_number', ''),
        ];
    }
}
