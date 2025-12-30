<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OrganizationContext
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        
        if ($user && $user->corporate_id) {
            // Set organization context for the request
            $request->merge(['organization_id' => $user->corporate_id]);
            
            // Store in config for global access
            config(['app.current_organization_id' => $user->corporate_id]);
        }

        return $next($request);
    }
}