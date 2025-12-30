<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CorporateController;
use App\Http\Controllers\CorporateAuthController;
use App\Http\Controllers\Corporate\CorporateDashboardController;
use App\Http\Controllers\Corporate\CorporateUsersController;
use App\Http\Controllers\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\SettingController;

Route::prefix('v1')->middleware('cors')->group(function () {
    // Auth routes (public)
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
        Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
    });

    // Super admin login
    Route::post('/super/login', [SuperAdminController::class, 'login']);
    
    // Corporate info endpoint (public)
    Route::get('/organization/{organizationCode}', [CorporateController::class, 'getByCode']);
    
    // Corporate authentication
    Route::prefix('{corporateName}')->group(function () {
        Route::post('/login', [CorporateAuthController::class, 'login']);
        Route::post('/logout', [CorporateAuthController::class, 'logout'])->middleware('auth:api');
        Route::post('/refresh', [CorporateAuthController::class, 'refresh'])->middleware('auth:api');
        Route::get('/me', [CorporateAuthController::class, 'me'])->middleware('auth:api');
    });

    // Organization management (public for testing)
    Route::apiResource('organizations', OrganizationController::class);
    
    // Dashboard endpoints (public for testing)
    Route::get('/dashboard/super-admin-test', [DashboardController::class, 'superAdminStats']);
    
    // Corporate API endpoints (with auth)
    Route::prefix('corporate')->middleware('auth:api')->group(function () {
        Route::get('/dashboard', [CorporateDashboardController::class, 'dashboard']);
        Route::get('/users', [CorporateUsersController::class, 'index']);
        Route::post('/users', [CorporateUsersController::class, 'store']);
    });
    
    // Super Admin API endpoints (with auth)
    Route::prefix('super-admin')->middleware('auth:api')->group(function () {
        Route::get('/dashboard', [SuperAdminDashboardController::class, 'dashboard']);
    });
    
    // Organization users management
    Route::prefix('organization/{organizationId}/users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // Protected routes with organization context
    Route::middleware(['auth:api', 'organization.context'])->group(function () {
        Route::get('/user', function (Request $request) {
            return response()->json(['success' => true, 'user' => $request->user()]);
        });

        // Dashboard endpoints
        Route::get('/dashboard/super-admin', [DashboardController::class, 'superAdminStats']);

        // Settings endpoints
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'store']);
        Route::get('/settings/{key}', [SettingController::class, 'show']);
        Route::delete('/settings/{key}', [SettingController::class, 'destroy']);

        // Admin routes
        Route::middleware('permission:admin')->group(function () {
            Route::get('/organizations-protected', function () {
                return response()->json(['success' => true, 'message' => 'Organizations endpoint']);
            });
        });
    });
});