<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Requires a real cron trigger hitting `php artisan schedule:run` once deployed
// (e.g. Cloud Scheduler -> Cloud Run Job) - does nothing on its own locally.
Schedule::command('app:sync-google-sheets')->hourly();
