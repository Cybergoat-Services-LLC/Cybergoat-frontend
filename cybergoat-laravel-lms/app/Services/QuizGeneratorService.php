<?php

namespace App\Services;

use App\Services\Concerns\CallsVertexAi;

class QuizGeneratorService
{
    use CallsVertexAi;

    /**
     * Draft multiple-choice questions via Vertex AI Gemini. These are a
     * starting point only - the caller is responsible for having an admin
     * review/edit them before the quiz is published; nothing here ever
     * publishes a quiz on its own.
     *
     * @return array<int, array{question: string, options: array<int, string>, correct_index: int, explanation: string}>
     */
    public function generateDraftQuestions(string $topic, int $count = 5): array
    {
        $prompt = <<<PROMPT
        Generate exactly {$count} multiple-choice quiz questions for a cybersecurity training course on the topic: "{$topic}".
        Return ONLY a raw JSON array with no markdown code fences and no surrounding prose. Each element must have exactly this shape:
        {"question": "...", "options": ["...", "...", "...", "..."], "correct_index": 0, "explanation": "..."}
        "correct_index" is the 0-based index into "options" of the single correct answer. Exactly 4 options per question.
        PROMPT;

        $text = $this->callGemini($prompt, temperature: 0.4);
        $text = trim(preg_replace('/^```(json)?|```$/m', '', $text));

        $decoded = json_decode($text, true);

        if (!is_array($decoded) || empty($decoded)) {
            throw new \RuntimeException('The AI did not return a usable question list. Try again or write questions manually.');
        }

        return $decoded;
    }
}
