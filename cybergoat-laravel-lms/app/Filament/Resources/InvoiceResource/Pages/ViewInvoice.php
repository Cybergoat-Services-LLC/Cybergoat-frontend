<?php

namespace App\Filament\Resources\InvoiceResource\Pages;

use App\Filament\Resources\InvoiceResource;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;

class ViewInvoice extends ViewRecord
{
    protected static string $resource = InvoiceResource::class;

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            TextEntry::make('invoice_number'),
            TextEntry::make('user.name')->label('Customer'),
            TextEntry::make('user.email')->label('Email'),
            TextEntry::make('course.title')->label('Course'),
            TextEntry::make('subtotal')->money(fn ($record) => $record->currency),
            TextEntry::make('coupon_code')->placeholder('None'),
            TextEntry::make('discount_amount')->money(fn ($record) => $record->currency),
            TextEntry::make('vat_rate_applied')->suffix('%'),
            TextEntry::make('vat_amount')->money(fn ($record) => $record->currency),
            TextEntry::make('total')->money(fn ($record) => $record->currency),
            TextEntry::make('company_trn_snapshot')->label('TRN at time of sale')->placeholder('Not VAT-registered at time of sale'),
            TextEntry::make('payment_method'),
            TextEntry::make('payment_status'),
            TextEntry::make('payment_reference')->placeholder('—'),
            TextEntry::make('confirmedBy.name')->label('Confirmed by')->placeholder('—'),
            TextEntry::make('paid_at')->dateTime()->placeholder('Not yet paid'),
        ]);
    }
}
