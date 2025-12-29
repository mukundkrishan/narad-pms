<?php

use Illuminate\Support\Facades\Route;

// V1 API Routes
Route::get('/', function () {
    return response()->json([
        'message' => 'Narad PMS API v1',
        'version' => '1.0.0',
        'endpoints' => [
            'health' => '/api/v1/health',
            'auth' => '/api/v1/auth/*',
            'projects' => '/api/v1/projects',
            'tasks' => '/api/v1/tasks'
        ]
    ]);
});

// Additional v1 specific routes can be added here