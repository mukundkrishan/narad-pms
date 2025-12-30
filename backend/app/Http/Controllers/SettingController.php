<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class SettingController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $settings = Setting::where('user_id', $request->user()->id)->get();
        
        $formattedSettings = $settings->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->value];
        });

        return $this->successResponse($formattedSettings);
    }

    public function store(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        $userId = $request->user()->id;
        $updatedSettings = [];

        foreach ($request->settings as $key => $value) {
            $type = $this->getValueType($value);
            
            $setting = Setting::updateOrCreate(
                ['user_id' => $userId, 'key' => $key],
                ['value' => $value, 'type' => $type]
            );
            
            $updatedSettings[$key] = $setting->value;
        }

        return $this->successResponse($updatedSettings, 'Settings updated successfully');
    }

    public function show(Request $request, $key)
    {
        $setting = Setting::where('user_id', $request->user()->id)
                          ->where('key', $key)
                          ->first();

        if (!$setting) {
            return $this->errorResponse('Setting not found', 404);
        }

        return $this->successResponse([$key => $setting->value]);
    }

    public function destroy(Request $request, $key)
    {
        $deleted = Setting::where('user_id', $request->user()->id)
                         ->where('key', $key)
                         ->delete();

        if (!$deleted) {
            return $this->errorResponse('Setting not found', 404);
        }

        return $this->successResponse(null, 'Setting deleted successfully');
    }

    private function getValueType($value)
    {
        if (is_bool($value)) {
            return 'boolean';
        } elseif (is_numeric($value)) {
            return 'number';
        } elseif (is_array($value) || is_object($value)) {
            return 'json';
        } else {
            return 'string';
        }
    }
}