<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class BusinessSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Business Settings';

    protected static string $view = 'filament.pages.business-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'vat_enabled' => Setting::vatEnabled(),
            'vat_rate' => Setting::vatRate(),
            'company_trn' => Setting::companyTrn(),
            'bank_account_name' => Setting::get('bank_account_name', ''),
            'bank_name' => Setting::get('bank_name', ''),
            'bank_iban' => Setting::get('bank_iban', ''),
            'bank_swift' => Setting::get('bank_swift', ''),
            'bank_account_number' => Setting::get('bank_account_number', ''),
            'aani_proxy_id' => Setting::get('aani_proxy_id', ''),
            'aani_qr_image_url' => Setting::get('aani_qr_image_url', ''),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('VAT / Tax')
                    ->description('You are not VAT-registered yet - keep this off. Flip it on the moment your accountant confirms FTA registration, no code change needed.')
                    ->schema([
                        Forms\Components\Toggle::make('vat_enabled')
                            ->label('Charge VAT on invoices')
                            ->live(),
                        Forms\Components\TextInput::make('vat_rate')
                            ->label('VAT rate (%)')
                            ->numeric()
                            ->visible(fn (Forms\Get $get) => $get('vat_enabled')),
                        Forms\Components\TextInput::make('company_trn')
                            ->label('Company TRN')
                            ->visible(fn (Forms\Get $get) => $get('vat_enabled')),
                    ]),

                Forms\Components\Section::make('Bank Transfer Details')
                    ->description('Shown to customers who choose "Bank Transfer" at checkout.')
                    ->schema([
                        Forms\Components\TextInput::make('bank_account_name'),
                        Forms\Components\TextInput::make('bank_name'),
                        Forms\Components\TextInput::make('bank_iban')->label('IBAN'),
                        Forms\Components\TextInput::make('bank_swift')->label('SWIFT / BIC'),
                        Forms\Components\TextInput::make('bank_account_number'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Aani QR Payment')
                    ->description('Shown to customers who choose "Aani QR" at checkout.')
                    ->schema([
                        Forms\Components\TextInput::make('aani_proxy_id')
                            ->label('Aani proxy ID (mobile/email)'),
                        Forms\Components\TextInput::make('aani_qr_image_url')
                            ->label('QR image URL')
                            ->helperText('Generate this in the Wio Business app, then paste its hosted URL here.'),
                    ])
                    ->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        Setting::set('vat_enabled', $state['vat_enabled'] ? 'true' : 'false');
        Setting::set('vat_rate', (string) $state['vat_rate']);
        Setting::set('company_trn', (string) $state['company_trn']);
        Setting::set('bank_account_name', (string) $state['bank_account_name']);
        Setting::set('bank_name', (string) $state['bank_name']);
        Setting::set('bank_iban', (string) $state['bank_iban']);
        Setting::set('bank_swift', (string) $state['bank_swift']);
        Setting::set('bank_account_number', (string) $state['bank_account_number']);
        Setting::set('aani_proxy_id', (string) $state['aani_proxy_id']);
        Setting::set('aani_qr_image_url', (string) $state['aani_qr_image_url']);

        Notification::make()
            ->title('Settings saved')
            ->success()
            ->send();
    }
}
