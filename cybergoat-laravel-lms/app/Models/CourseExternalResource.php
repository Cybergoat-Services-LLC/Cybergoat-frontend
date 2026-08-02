<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseExternalResource extends Model
{
    protected $fillable = [
        'course_id',
        'provider',
        'title',
        'url',
        'description',
        'sort',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
