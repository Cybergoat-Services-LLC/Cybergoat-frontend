<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_bundles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paid_course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('bundled_course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['paid_course_id', 'bundled_course_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_bundles');
    }
};
