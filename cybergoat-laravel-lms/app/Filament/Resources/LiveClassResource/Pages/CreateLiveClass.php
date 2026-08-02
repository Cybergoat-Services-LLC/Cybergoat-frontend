<?php

namespace App\Filament\Resources\LiveClassResource\Pages;

use App\Filament\Resources\LiveClassResource;
use App\Services\GoogleCalendarService;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreateLiveClass extends CreateRecord
{
    protected static string $resource = LiveClassResource::class;

    /**
     * Auto-generate the Meet link immediately for virtual classes so the
     * admin doesn't need a second click - only if they didn't already paste
     * a link in manually.
     */
    protected function afterCreate(): void
    {
        $record = $this->record;

        if ($record->type !== 'live_virtual' || $record->google_calendar_event_id) {
            return;
        }

        try {
            app(GoogleCalendarService::class)->createMeetEvent($record);
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Class saved, but the Meet link could not be auto-generated')
                ->body('Use "Generate Meet Link" on the list page once Google Calendar access is configured. ' . $e->getMessage())
                ->warning()
                ->send();
        }
    }
}
