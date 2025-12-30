<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// CORS preflight route
Route::options('{any}', function () {
    return response('', 200);
})->where('any', '.*');