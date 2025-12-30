<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('corporates', function (Blueprint $table) {
            $table->string('organization_code')->nullable()->after('slug');
            $table->integer('user_allowed')->default(10)->after('address');
            $table->date('valid_from')->nullable()->after('user_allowed');
            $table->date('valid_to')->nullable()->after('valid_from');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('is_active');
            $table->decimal('last_payment_made', 10, 2)->nullable()->after('status');
        });
        
        // Add unique constraint after adding the column
        Schema::table('corporates', function (Blueprint $table) {
            $table->unique('organization_code');
        });
    }

    public function down(): void
    {
        Schema::table('corporates', function (Blueprint $table) {
            $table->dropColumn([
                'organization_code',
                'user_allowed',
                'valid_from',
                'valid_to',
                'status',
                'last_payment_made'
            ]);
        });
    }
};