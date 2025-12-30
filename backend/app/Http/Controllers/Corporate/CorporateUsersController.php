<?php

namespace App\Http\Controllers\Corporate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Traits\ApiResponse;

class CorporateUsersController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $user = auth()->user();
        $corporateId = $user->corporate_id;

        $users = User::where('corporate_id', $corporateId)
            ->select('id', 'first_name', 'last_name', 'email', 'mobile', 'role_id', 'status', 'created_at')
            ->paginate(10);

        return $this->successResponse($users, 'Corporate users retrieved');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'mobile' => 'nullable|string|max:20',
            'role_id' => 'required|in:2,3',
        ]);

        $user = auth()->user();
        $corporateId = $user->corporate_id;

        $newUser = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'password' => bcrypt('123456'),
            'corporate_id' => $corporateId,
            'role_id' => $request->role_id,
            'status' => 'active',
        ]);

        return $this->successResponse($newUser, 'User created successfully');
    }
}