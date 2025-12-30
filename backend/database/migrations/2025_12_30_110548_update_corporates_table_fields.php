<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('corporates', function (Blueprint $table) {
            if (!Schema::hasColumn('corporates', 'organization_code')) {
                $table->string('organization_code')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('corporates', 'user_allowed')) {
                $table->integer('user_allowed')->default(10)->after('address');
            }
            if (!Schema::hasColumn('corporates', 'valid_from')) {
                $table->date('valid_from')->nullable()->after('user_allowed');
            }
            if (!Schema::hasColumn('corporates', 'valid_to')) {
                $table->date('valid_to')->nullable()->after('valid_from');
            }
            if (!Schema::hasColumn('corporates', 'status')) {
                $table->enum('status', ['active', 'inactive'])->default('active')->after('is_active');
            }
            if (!Schema::hasColumn('corporates', 'last_payment_made')) {
                $table->decimal('last_payment_made', 10, 2)->nullable()->after('status');
            }
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