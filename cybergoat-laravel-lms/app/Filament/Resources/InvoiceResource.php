<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InvoiceResource\Pages;
use App\Models\Invoice;
use Filament\Forms;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;

    protected static ?string $navigationIcon = 'heroicon-o-receipt-percent';

    // Invoices are system-generated (checkout / offline payment) - no manual create/edit form.
    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('invoice_number')->searchable(),
                Tables\Columns\TextColumn::make('user.name')->label('Customer')->searchable(),
                Tables\Columns\TextColumn::make('course.title')->label('Course')->searchable(),
                Tables\Columns\TextColumn::make('total')->money(fn ($record) => $record->currency)->sortable(),
                Tables\Columns\BadgeColumn::make('payment_method')
                    ->colors([
                        'success' => 'stripe',
                        'warning' => fn ($state) => in_array($state, ['bank_transfer', 'aani_qr']),
                    ]),
                Tables\Columns\BadgeColumn::make('payment_status')
                    ->colors([
                        'success' => 'paid',
                        'warning' => 'pending',
                        'danger' => fn ($state) => in_array($state, ['failed', 'refunded']),
                    ]),
                Tables\Columns\TextColumn::make('confirmedBy.name')->label('Confirmed by')->toggleable(),
                Tables\Columns\TextColumn::make('paid_at')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options(['pending' => 'Pending', 'paid' => 'Paid', 'failed' => 'Failed', 'refunded' => 'Refunded']),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options(['stripe' => 'Stripe', 'bank_transfer' => 'Bank Transfer', 'aani_qr' => 'Aani QR']),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make('confirmPayment')
                    ->label('Confirm Payment')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (Invoice $record) => $record->payment_status === 'pending' && $record->payment_method !== 'stripe')
                    ->requiresConfirmation()
                    ->modalDescription('This marks the invoice paid and immediately grants the enrollment. Only do this once you have verified the money actually arrived.')
                    ->form([
                        Forms\Components\TextInput::make('payment_reference')
                            ->label('Bank / Aani transaction reference')
                            ->helperText('Optional, but useful for reconciling against your bank statement later.'),
                    ])
                    ->action(function (Invoice $record, array $data) {
                        $record->markPaidAndEnroll(auth()->user(), $data['payment_reference'] ?? null);

                        Notification::make()
                            ->title("Invoice {$record->invoice_number} confirmed paid")
                            ->success()
                            ->send();
                    }),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInvoices::route('/'),
            'view' => Pages\ViewInvoice::route('/{record}'),
        ];
    }
}
