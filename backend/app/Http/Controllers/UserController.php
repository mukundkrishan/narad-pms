<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Corporate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;

    public function index($organizationId)
    {
        $corporate = Corporate::find($organizationId);
        
        if (!$corporate) {
            return $this->errorResponse('Organization not found', 404);
        }

        $users = User::where('corporate_id', $corporate->id)
                    ->select('id', 'name', 'first_name', 'last_name', 'email', 'mobile', 'address', 'role', 'role_id', 'status', 'created_at')
                    ->get()
                    ->map(function ($user) {
                        // Handle existing users without first_name/last_name
                        if (!$user->first_name && !$user->last_name && $user->name) {
                            $nameParts = explode(' ', $user->name, 2);
                            $user->first_name = $nameParts[0] ?? '';
                            $user->last_name = $nameParts[1] ?? '';
                        }
                        return $user;
                    });

        return $this->successResponse([
            'users' => $users,
            'organization_name' => $corporate->name
        ]);
    }

    public function store(Request $request, $organizationId)
    {
        $corporate = Corporate::find($organizationId);
        
        if (!$corporate) {
            return $this->errorResponse('Organization not found', 404);
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'role' => 'required|in:admin,user',
            'password' => 'required|string|min:6',
        ]);

        $roleId = $request->role === 'admin' ? User::ROLE_ADMIN : User::ROLE_USER;

        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'address' => $request->address,
            'password' => Hash::make($request->password),
            'corporate_id' => $corporate->id,
            'role' => $request->role,
            'role_id' => $roleId,
            'status' => 'active',
        ]);

        return $this->successResponse($user, 'User created successfully', 201);
    }

    public function update(Request $request, $organizationId, $id)
    {
        $corporate = Corporate::find($organizationId);
        
        if (!$corporate) {
            return $this->errorResponse('Organization not found', 404);
        }

        $user = User::where('corporate_id', $corporate->id)->find($id);
        
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        // Handle status-only updates
        if ($request->has('status') && count($request->all()) === 1) {
            $user->update(['status' => $request->status]);
            return $this->successResponse($user, 'User status updated successfully');
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|min:6',
        ]);

        $roleId = $request->role === 'admin' ? User::ROLE_ADMIN : User::ROLE_USER;

        $updateData = [
            'name' => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'address' => $request->address,
            'role' => $request->role,
            'role_id' => $roleId,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return $this->successResponse($user, 'User updated successfully');
    }

    public function destroy($organizationId, $id)
    {
        $corporate = Corporate::find($organizationId);
        
        if (!$corporate) {
            return $this->errorResponse('Organization not found', 404);
        }

        $user = User::where('corporate_id', $corporate->id)->find($id);
        
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        // Prevent deletion of admin users
        if ($user->isAdmin()) {
            return $this->errorResponse('Admin users cannot be deleted', 403);
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }
}