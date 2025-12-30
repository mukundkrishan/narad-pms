<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Corporate;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class OrganizationController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search = $request->get('search');

        $query = Corporate::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        $organizations = $query->withCount('users')
                              ->orderBy('created_at', 'desc')
                              ->paginate($perPage);

        return $this->paginatedResponse($organizations, 'Organizations retrieved successfully');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:corporates,email,NULL,id,deleted_at,NULL',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'organization_code' => 'required|string|unique:corporates,organization_code,NULL,id,deleted_at,NULL',
            'user_allowed' => 'required|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_to' => 'nullable|date',
            'last_payment_date' => 'nullable|date',
            'last_payment_amount' => 'nullable|numeric|min:0',
        ]);

        $organization = Corporate::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'organization_code' => $request->organization_code,
            'user_allowed' => $request->user_allowed,
            'valid_from' => $request->valid_from,
            'valid_to' => $request->valid_to,
            'status' => 'active',
            'last_payment_date' => $request->last_payment_date,
            'last_payment_amount' => $request->last_payment_amount,
            'is_active' => true,
        ]);

        // Create default admin user for the organization
        User::create([
            'name' => 'Admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => $request->email,
            'password' => Hash::make('123456'),
            'corporate_id' => $organization->id,
            'role' => 'admin',
            'role_id' => User::ROLE_ADMIN,
            'status' => 'active',
        ]);

        $organization->admin_password = '123456'; // For response only

        return $this->successResponse($organization, 'Organization created successfully', 201);
    }

    public function show($id)
    {
        $organization = Corporate::withCount('users')->findOrFail($id);
        return $this->successResponse($organization, 'Organization retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $organization = Corporate::findOrFail($id);

        // If only status is being updated (toggle)
        if ($request->has('status') && count($request->all()) === 1) {
            $request->validate([
                'status' => 'required|in:active,inactive',
            ]);
            
            $organization->update([
                'status' => $request->status,
            ]);
            
            return $this->successResponse($organization, 'Organization status updated successfully');
        }

        // Full update validation
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:corporates,email,' . $id . ',id,deleted_at,NULL',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'organization_code' => 'required|string|unique:corporates,organization_code,' . $id . ',id,deleted_at,NULL',
            'user_allowed' => 'required|integer|min:1',
            'valid_from' => 'nullable|date',
            'valid_to' => 'nullable|date|after:valid_from',
            'last_payment_date' => 'nullable|date',
            'last_payment_amount' => 'nullable|numeric|min:0',
            'status' => 'in:active,inactive',
        ]);

        $organization->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'organization_code' => $request->organization_code,
            'user_allowed' => $request->user_allowed,
            'valid_from' => $request->valid_from,
            'valid_to' => $request->valid_to,
            'status' => $request->get('status', $organization->status),
            'last_payment_date' => $request->last_payment_date,
            'last_payment_amount' => $request->last_payment_amount,
        ]);

        return $this->successResponse($organization, 'Organization updated successfully');
    }

    public function destroy($id)
    {
        $organization = Corporate::findOrFail($id);
        $organization->delete();

        return $this->successResponse(null, 'Organization deleted successfully');
    }
}