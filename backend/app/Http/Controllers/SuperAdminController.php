<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SuperAdminController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                   ->where('user_type', 'super_admin')
                   ->first();

        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('super-admin-token')->plainTextToken;
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $token,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }
}