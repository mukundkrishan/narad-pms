<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Corporate;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Traits\ApiResponse;

class CorporateAuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request, $corporateName)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find corporate by organization_code
        $corporate = Corporate::where('organization_code', $corporateName)
                            ->where('status', 'active')
                            ->first();
        
        if (!$corporate) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        // Find user in this corporate
        $user = User::where('email', $request->email)
                   ->where('corporate_id', $corporate->id)
                   ->whereIn('role_id', [User::ROLE_ADMIN, User::ROLE_USER])
                   ->where('status', 'active')
                   ->first();

        if (!$user) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        $token = JWTAuth::fromUser($user);
        
        return $this->successResponse([
            'user' => $user,
            'corporate' => $corporate,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60
        ], 'Corporate login successful');
    }

    public function logout(Request $request)
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return $this->successResponse(null, 'Successfully logged out');
    }

    public function refresh(Request $request)
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        return $this->successResponse(['token' => $token], 'Token refreshed');
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $corporate = $user->corporate;
        
        return $this->successResponse([
            'user' => $user,
            'corporate' => $corporate
        ], 'User profile retrieved');
    }
}