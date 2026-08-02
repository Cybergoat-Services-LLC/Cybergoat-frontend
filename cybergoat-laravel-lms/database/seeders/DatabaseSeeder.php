<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(CybergoatSeeder::class);

        // Not VAT-registered yet — off by default. Flip 'vat_enabled' to 'true'
        // once FTA registration is confirmed; no code change needed.
        Setting::set('vat_enabled', 'false');
        Setting::set('vat_rate', '5');
        Setting::set('company_trn', '');

        // Real IBAN/account/SWIFT are deliberately NOT hardcoded here — they're
        // set at runtime (tinker / Filament later) so they never land in git
        // history, same treatment as the Stripe keys and GCS credentials.
        Setting::set('bank_account_name', 'CYBERGOAT SERVICES - FZCO');
        Setting::set('bank_name', 'Wio Bank PJSC');
        Setting::set('bank_iban', '');
        Setting::set('bank_swift', '');
        Setting::set('bank_account_number', '');
        Setting::set('aani_proxy_id', ''); // mobile number / email registered for Aani
        Setting::set('aani_qr_image_url', ''); // static QR image, generated via Wio Business app
    }
}
