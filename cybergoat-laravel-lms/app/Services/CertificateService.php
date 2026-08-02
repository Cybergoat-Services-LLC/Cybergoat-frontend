<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Google\Cloud\Storage\StorageClient;

class CertificateService
{
    /**
     * Mark an enrollment completed and issue its certificate: generate the
     * PDF, upload it, and persist the record. Idempotent - re-calling for an
     * enrollment that already has one just returns the existing certificate.
     * Single source of truth shared by the API controller and the Filament
     * admin action, so a fix in one place can't be forgotten in the other.
     */
    public function issueForEnrollment(Enrollment $enrollment, User $issuedBy): Certificate
    {
        $existing = Certificate::where('enrollment_id', $enrollment->id)->first();

        if ($existing) {
            return $existing;
        }

        if ($enrollment->status !== 'completed') {
            $enrollment->update(['status' => 'completed']);
        }

        $course = $enrollment->course;

        $certificate = Certificate::create([
            'user_id' => $enrollment->user_id,
            'course_id' => $enrollment->course_id,
            'enrollment_id' => $enrollment->id,
            'type' => Certificate::typeForCourse($course),
            'title' => "Certificate of Completion — {$course->title}",
            'issued_by' => $issuedBy->id,
            'issued_at' => now(),
        ]);

        $certificate->update([
            'certificate_number' => 'CG-CERT-' . str_pad((string) $certificate->id, 6, '0', STR_PAD_LEFT),
        ]);

        $objectPath = "certificates/{$certificate->certificate_number}.pdf";
        $pdfBytes = $this->generatePdf($certificate);
        $this->uploadAndSign($objectPath, $pdfBytes);

        $certificate->update(['gcs_object_path' => $objectPath]);

        return $certificate->fresh();
    }

    /**
     * Render the certificate PDF to raw bytes via a plain HTML/CSS Blade
     * template (dompdf) - no headless-browser dependency, no external API,
     * deterministic output. Kept deliberately simple for reliability.
     */
    public function generatePdf(Certificate $certificate): string
    {
        return Pdf::loadView('certificates.template', ['certificate' => $certificate])
            ->setPaper('a4', 'landscape')
            ->output();
    }

    /**
     * Upload the generated PDF to the private course-kits bucket under a
     * certificates/ prefix, and return a 60-minute V4 signed URL to it.
     */
    public function uploadAndSign(string $objectPath, string $pdfBytes): string
    {
        $storage = new StorageClient([
            'projectId' => config('filesystems.gcs.project_id'),
            'keyFilePath' => config('filesystems.gcs.key_file'),
        ]);

        $bucket = $storage->bucket(config('filesystems.gcs.bucket'));
        $bucket->upload($pdfBytes, ['name' => $objectPath]);

        return $bucket->object($objectPath)->signedUrl(now()->addMinutes(60), ['version' => 'v4']);
    }
}
