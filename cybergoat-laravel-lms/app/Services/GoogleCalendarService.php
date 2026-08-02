<?php

namespace App\Services;

use App\Models\LiveClass;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\ConferenceSolutionKey;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Str;

class GoogleCalendarService
{
    /**
     * Create a real Calendar event with an auto-generated Google Meet link
     * for a virtual live class, and store the event ID for future updates.
     * Requires domain-wide delegation to be configured in the Workspace
     * Admin Console for the service account - that's a one-time manual
     * setup step only a Workspace super admin can do, not something this
     * code can complete on its own.
     */
    public function createMeetEvent(LiveClass $liveClass): string
    {
        $start = $liveClass->scheduled_at;
        $end = $start->copy()->addMinutes($liveClass->duration_minutes);

        $event = new Event([
            'summary' => $liveClass->topic,
            'description' => "CyberGOAT live class for {$liveClass->course->title}.",
            'start' => new EventDateTime([
                'dateTime' => $start->toRfc3339String(),
                'timeZone' => 'Asia/Dubai',
            ]),
            'end' => new EventDateTime([
                'dateTime' => $end->toRfc3339String(),
                'timeZone' => 'Asia/Dubai',
            ]),
            'conferenceData' => new ConferenceData([
                'createRequest' => new CreateConferenceRequest([
                    'requestId' => (string) Str::uuid(),
                    'conferenceSolutionKey' => new ConferenceSolutionKey(['type' => 'hangoutsMeet']),
                ]),
            ]),
        ]);

        $createdEvent = $this->client()->events->insert(
            config('services.google_calendar.calendar_id', 'primary'),
            $event,
            ['conferenceDataVersion' => 1]
        );

        $liveClass->update([
            'google_calendar_event_id' => $createdEvent->getId(),
            'location_or_link' => $createdEvent->getHangoutLink(),
        ]);

        return $createdEvent->getHangoutLink();
    }

    protected function client(): Calendar
    {
        $googleClient = new Client();
        $googleClient->setAuthConfig(config('services.google_calendar.key_file'));
        $googleClient->addScope(Calendar::CALENDAR_EVENTS);
        $googleClient->setSubject(config('services.google_calendar.impersonate_email'));

        return new Calendar($googleClient);
    }
}
