<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'certification_code',
        'vendor',
        'hours',
        'level',
        'description',
        'is_official_voucher_included',
        'price',
        'currency',
    ];

    protected $casts = [
        'is_official_voucher_included' => 'boolean',
        'hours' => 'integer',
        'price' => 'decimal:2',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function kitDownloads()
    {
        return $this->hasMany(KitDownload::class);
    }

    public function liveClasses()
    {
        return $this->hasMany(LiveClass::class);
    }

    /**
     * Free/bonus courses automatically enrolled alongside this one when purchased.
     */
    public function bundledCourses()
    {
        return $this->belongsToMany(
            Course::class,
            'course_bundles',
            'paid_course_id',
            'bundled_course_id'
        );
    }

    /**
     * Inverse of bundledCourses() - the paid courses this one is bundled
     * into. Needed explicitly because this is a self-referential
     * belongsToMany (Course <-> Course); Filament's admin panel can't guess
     * an inverse relationship name on the same model.
     */
    public function bundledInCourses()
    {
        return $this->belongsToMany(
            Course::class,
            'course_bundles',
            'bundled_course_id',
            'paid_course_id'
        );
    }

    /**
     * Curated links to free third-party courses (Microsoft, Anthropic, etc.)
     * shown alongside this course. Informational only - CyberGOAT doesn't
     * host or track completion for these, so no enrollment is created.
     */
    public function externalResources()
    {
        return $this->hasMany(CourseExternalResource::class)->orderBy('sort');
    }
}
