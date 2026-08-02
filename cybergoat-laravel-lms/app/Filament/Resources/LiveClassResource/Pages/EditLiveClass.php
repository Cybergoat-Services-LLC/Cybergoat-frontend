<?php

namespace App\Filament\Resources\LiveClassResource\Pages;

use App\Filament\Resources\LiveClassResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLiveClass extends EditRecord
{
    protected static string $resource = LiveClassResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
