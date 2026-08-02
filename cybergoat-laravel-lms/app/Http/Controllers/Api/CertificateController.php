<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Services\CertificateService;
use App\Services\GcsKitSigner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function __construct(
        private CertificateService $certificates,
        private GcsKitSigner $signer,
    ) {
    }

    /**
     * The authenticated user's own certificates, each with a fresh signed
     * download URL (never stored - signed URLs expire, so we mint a new
     * one on every read rather than caching a stale link).
     */
    public function index(Request $request): JsonResponse
    {
        $certificates = Certificate::where('user_id', $request->user()->id)
            ->with('course:id,title,certification_code')
            ->get()
            ->map(fn (Certificate $cert) => [
                'certificate_number' => $cert->certificate_number,
                'title' => $cert->title,
                'type' => $cert->type,
                'course' => $cert->course->title,
                'issued_at' => $cert->issued_at?->toIso8601String(),
                'download_url' => $this->signer->sign($cert->gcs_object_path, now()->addMinutes(60)),
            ]);

        return response()->json(['success' => true, 'data' => $certificates]);
    }

    /**
     * Public verification lookup - deliberately returns no download link,
     * only enough to confirm a certificate number is genuine.
     */
    public function verify(string $certificateNumber): JsonResponse
    {
        $certificate = Certificate::where('certificate_number', $certificateNumber)
            ->with(['user:id,name', 'course:id,title'])
            ->first();

        if (!$certificate) {
            return response()->json(['success' => false, 'valid' => false, 'message' => 'No certificate found with this number.'], 404);
        }

        return response()->json([
            'success' => true,
            'valid' => true,
            'certificate_number' => $certificate->certificate_number,
            'recipient_name' => $certificate->user->name,
            'course_title' => $certificate->course->title,
            'issuer_name' => $certificate->issuer_name,
            'issued_at' => $certificate->issued_at?->toIso8601String(),
        ]);
    }

    /**
     * Admin-only: mark an enrollment completed and issue its certificate.
     * Idempotent - re-issuing for the same enrollment returns the existing
     * certificate rather than generating a duplicate.
     */
    public function issue(Request $request, Enrollment $enrollment): JsonResponse
    {
        $wasAlreadyIssued = Certificate::where('enrollment_id', $enrollment->id)->exists();

        $certificate = $this->certificates->issueForEnrollment($enrollment, $request->user());

        return response()->json([
            'success' => true,
            'certificate_number' => $certificate->certificate_number,
            'type' => $certificate->type,
            'download_url' => $this->signer->sign($certificate->gcs_object_path, now()->addMinutes(60)),
            'already_issued' => $wasAlreadyIssued,
        ], $wasAlreadyIssued ? 200 : 201);
    }
}
