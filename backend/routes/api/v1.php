<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Super Admin Routes
Route::prefix('super')->group(function () {
    Route::post('/login', function () {
        return response()->json(['message' => 'Super admin login']);
    });
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/corporates', function () {
            return response()->json(['corporates' => []]);
        });
        Route::post('/corporates', function () {
            return response()->json(['message' => 'Corporate created']);
        });
        Route::get('/plans', function () {
            return response()->json(['plans' => []]);
        });
    });
});

// Corporate Routes
Route::prefix('{corporate}')->group(function () {
    Route::post('/login', function ($corporate) {
        return response()->json(['message' => "Login for {$corporate}"]);
    });
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/users', function () {
            return response()->json(['users' => []]);
        });
        Route::post('/users', function () {
            return response()->json(['message' => 'User created']);
        });
        Route::get('/roles', function () {
            return response()->json(['roles' => []]);
        });
        Route::post('/roles', function () {
            return response()->json(['message' => 'Role created']);
        });
    });
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'version' => 'v1']);
});