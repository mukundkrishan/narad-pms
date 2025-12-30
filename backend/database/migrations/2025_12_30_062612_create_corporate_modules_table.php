<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('corporate_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('corporate_id')->constrained()->onDelete('cascade');
            $table->foreignId('module_id')->constrained()->onDelete('cascade');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            
            $table->unique(['corporate_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('corporate_modules');
    }
};