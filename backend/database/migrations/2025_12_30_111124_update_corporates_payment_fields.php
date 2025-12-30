<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('corporates', function (Blueprint $table) {
            $table->dropColumn('last_payment_made');
            $table->date('last_payment_date')->nullable();
            $table->decimal('last_payment_amount', 10, 2)->nullable();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('corporates', function (Blueprint $table) {
            $table->decimal('last_payment_made', 10, 2)->nullable();
            $table->dropColumn(['last_payment_date', 'last_payment_amount']);
            $table->dropSoftDeletes();
        });
    }
};