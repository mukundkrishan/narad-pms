<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController;

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

    // Protected routes with organization context
    Route::middleware(['auth:api', 'organization.context'])->group(function () {
        Route::get('/user', function (Request $request) {
            return response()->json(['success' => true, 'user' => $request->user()]);
        });

        // Admin routes
        Route::middleware('permission:admin')->group(function () {
            Route::get('/organizations', function () {
                return response()->json(['success' => true, 'message' => 'Organizations endpoint']);
            });
        });
    });
});