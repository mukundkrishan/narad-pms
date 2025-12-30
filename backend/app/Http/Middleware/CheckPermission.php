<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Super admin has all permissions
        if ($user->user_type === 'super_admin') {
            return $next($request);
        }

        // Check user permissions
        $userPermissions = $user->permissions ?? [];
        
        if (!in_array($permission, $userPermissions)) {
            return response()->json(['success' => false, 'message' => 'Insufficient permissions'], 403);
        }

        return $next($request);
    }
}