<x-filament-panels::page>
    <x-filament::section>
        <x-slot name="heading">Google Sheets Reporting Sync</x-slot>
        <x-slot name="description">
            Pushes a fresh copy of Enrollments, Invoices, and Certificates into your reporting spreadsheet.
            One-way only - nothing here reads back from the Sheet, so editing it directly won't affect the app.
            Once you're in the Sheet, Gemini-in-Sheets can help you summarize or analyze it.
        </x-slot>

        <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">
                @if ($lastSynced = $this->getLastSyncedAt())
                    Last synced: {{ \Illuminate\Support\Carbon::parse($lastSynced)->diffForHumans() }}
                @else
                    Never synced yet.
                @endif
            </p>

            <x-filament::button wire:click="sync" icon="heroicon-o-arrow-path">
                Sync Now
            </x-filament::button>
        </div>
    </x-filament::section>
</x-filament-panels::page>
