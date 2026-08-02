<?php

namespace App\Services\Concerns;

use Google\Client;
use Illuminate\Support\Facades\Http;

/**
 * Shared Vertex AI (Gemini) calling logic - used by both the quiz question
 * generator and the content generator so the auth/HTTP plumbing exists in
 * exactly one place.
 */
trait CallsVertexAi
{
    protected function callGemini(string $prompt, float $temperature = 0.4): string
    {
        $url = sprintf(
            'https://%s-aiplatform.googleapis.com/v1/projects/%s/locations/%s/publishers/google/models/gemini-2.5-flash:generateContent',
            config('services.vertex_ai.location'),
            config('services.vertex_ai.project_id'),
            config('services.vertex_ai.location'),
        );

        $response = Http::withToken($this->fetchVertexAccessToken())
            ->timeout(30)
            ->post($url, [
                'contents' => [['role' => 'user', 'parts' => [['text' => $prompt]]]],
                'generationConfig' => ['temperature' => $temperature],
            ]);

        $response->throw();

        return trim(data_get($response->json(), 'candidates.0.content.parts.0.text', ''));
    }

    protected function fetchVertexAccessToken(): string
    {
        $client = new Client();
        $client->setAuthConfig(config('services.vertex_ai.key_file'));
        $client->addScope('https://www.googleapis.com/auth/cloud-platform');

        $token = $client->fetchAccessTokenWithAssertion();

        if (empty($token['access_token'])) {
            throw new \RuntimeException('Could not authenticate to Vertex AI - check GOOGLE_CLOUD_KEY_FILE and that the service account has roles/aiplatform.user.');
        }

        return $token['access_token'];
    }
}
