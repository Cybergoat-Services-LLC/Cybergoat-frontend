<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('certification_code')->nullable(); // CHFI, C|CISO, CEH, CISA, etc.
            $table->string('vendor')->default('EC-Council'); // EC-Council, ISACA, ISC2, IAPP
            $table->integer('hours')->default(40);
            $table->enum('level', ['Fundamentals', 'Intermediate', 'Advanced', 'Executive'])->default('Intermediate');
            $table->text('description');
            $table->boolean('is_official_voucher_included')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
