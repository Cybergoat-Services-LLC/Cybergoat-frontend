<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'user_id',
        'course_id',
        'enrollment_id',
        'type',
        'issuer_name',
        'title',
        'gcs_object_path',
        'issued_by',
        'issued_at',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function issuedBy()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * Which of the 3 certificate types a course produces:
     * - ec_council_aligned: official EC-Council courses (CEH, C|CISO, CHFI, etc.)
     * - vendor_aligned: other partner certs (ISACA, ISC2, IAPP, TOGAF)
     * - cybergoat_original: courses CyberGOAT authored itself
     */
    public static function typeForCourse(Course $course): string
    {
        return match ($course->vendor) {
            'EC-Council' => 'ec_council_aligned',
            'CyberGOAT' => 'cybergoat_original',
            default => 'vendor_aligned',
        };
    }
}
