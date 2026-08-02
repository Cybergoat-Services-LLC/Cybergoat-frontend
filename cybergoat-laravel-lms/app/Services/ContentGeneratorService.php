<?php

namespace App\Services;

use App\Services\Concerns\CallsVertexAi;

/**
 * Drafts marketing/catalog copy via Vertex AI Gemini. Every method here
 * returns a draft string only - nothing is ever saved automatically. The
 * Filament UI fills a form field with the draft; the admin still has to
 * review, edit, and click Save themselves before it goes anywhere.
 */
class ContentGeneratorService
{
    use CallsVertexAi;

    public function generateCourseDescription(string $courseTitle, string $keyPoints, ?string $vendor = null, ?string $level = null): string
    {
        $context = trim(implode(' ', array_filter([$vendor, $level ? "({$level} level)" : null])));

        $prompt = <<<PROMPT
        Write a professional, compelling course description for a cybersecurity training company's course catalog page.

        Course title: "{$courseTitle}"
        {$context}
        Key points to include: {$keyPoints}

        Write 2-3 plain-prose paragraphs, no markdown formatting, no headers, no bullet points. Confident and professional tone. Do not repeat the course title verbatim as a heading - start directly with the description.
        PROMPT;

        return $this->callGemini($prompt, temperature: 0.6);
    }

    public function generateExternalResourceDescription(string $provider, string $resourceTitle): string
    {
        $prompt = <<<PROMPT
        Write one short, plain sentence (max 25 words) describing this free bonus learning resource for a course catalog page.
        Provider: {$provider}
        Resource title: "{$resourceTitle}"
        Return only the sentence, no quotation marks, no markdown.
        PROMPT;

        return $this->callGemini($prompt, temperature: 0.5);
    }
}
