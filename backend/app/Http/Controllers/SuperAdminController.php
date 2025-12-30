<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Traits\ApiResponse;

class SuperAdminController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->role_id !== User::ROLE_SUPER_ADMIN) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $token = JWTAuth::fromUser($user);
        
        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ], 'Super admin login successful');
    }
}