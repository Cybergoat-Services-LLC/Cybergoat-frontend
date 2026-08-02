<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'stripe' => [
        'secret' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'google_sheets' => [
        // Same service account key as GCS - Sheets access is scoped by sharing
        // the specific spreadsheet with that service account's email, not IAM.
        'key_file' => env('GOOGLE_CLOUD_KEY_FILE'),
        'spreadsheet_id' => env('GOOGLE_SHEETS_SPREADSHEET_ID'),
    ],

    'vertex_ai' => [
        // Same service account as GCS/Sheets/Calendar - needs roles/aiplatform.user
        // granted on it too (same scoped-service-account pattern used everywhere else).
        'key_file' => env('GOOGLE_CLOUD_KEY_FILE'),
        'project_id' => env('GOOGLE_VERTEX_PROJECT_ID'),
        'location' => env('GOOGLE_VERTEX_LOCATION', 'us-central1'),
    ],

    'google_calendar' => [
        // Requires domain-wide delegation granted to this service account in
        // the Workspace Admin Console (Security > API Controls > Domain-wide
        // Delegation) for scope https://www.googleapis.com/auth/calendar.events
        // - a one-time manual step only a Workspace super admin can do.
        'key_file' => env('GOOGLE_CLOUD_KEY_FILE'),
        'impersonate_email' => env('GOOGLE_CALENDAR_IMPERSONATE_EMAIL'),
        'calendar_id' => env('GOOGLE_CALENDAR_ID', 'primary'),
    ],

];
