<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'version' => 'v1']);
    });

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/login', function () {
            return response()->json(['message' => 'Login endpoint']);
        });
        Route::post('/register', function () {
            return response()->json(['message' => 'Register endpoint']);
        });
        Route::post('/logout', function () {
            return response()->json(['message' => 'Logout endpoint']);
        });
    });

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Projects
        Route::apiResource('projects', \App\Http\Controllers\ProjectController::class);
        
        // Tasks
        Route::apiResource('tasks', \App\Http\Controllers\TaskController::class);
    });
});