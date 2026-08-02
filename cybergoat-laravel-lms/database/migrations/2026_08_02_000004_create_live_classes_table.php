<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('topic');
            $table->enum('type', ['dubai_campus', 'live_virtual'])->default('live_virtual');
            $table->string('location_or_link')->default('Dubai Silicon Oasis Campus / Zoom');
            $table->dateTime('scheduled_at');
            $table->integer('duration_minutes')->default(120);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_classes');
    }
};
