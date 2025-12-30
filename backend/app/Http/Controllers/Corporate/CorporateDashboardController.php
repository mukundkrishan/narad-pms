<?php

namespace App\Http\Controllers\Corporate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Corporate;
use App\Traits\ApiResponse;

class CorporateDashboardController extends Controller
{
    use ApiResponse;

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->corporate_id) {
            return $this->errorResponse('User not associated with any organization', 400);
        }
        
        $corporateId = $user->corporate_id;
        $corporate = Corporate::find($corporateId);
        
        if (!$corporate) {
            return $this->errorResponse('Organization not found', 404);
        }

        $stats = [
            'team_members' => User::where('corporate_id', $corporateId)->count(),
            'active_members' => User::where('corporate_id', $corporateId)->where('status', 'active')->count(),
            'organization_info' => $corporate,
            'recent_activities' => $this->getCorporateRecentActivities($corporateId),
            'user_roles' => User::where('corporate_id', $corporateId)
                ->selectRaw('role_id, COUNT(*) as count')
                ->groupBy('role_id')
                ->get(),
        ];

        return $this->successResponse($stats, 'Corporate dashboard data retrieved');
    }
    
    private function getCorporateRecentActivities($corporateId)
    {
        $activities = [];
        
        $recentUsers = User::where('corporate_id', $corporateId)
            ->latest()
            ->take(5)
            ->get();
        
        foreach ($recentUsers as $user) {
            $activities[] = [
                'time' => $user->created_at->diffForHumans(),
                'text' => "User '{$user->first_name} {$user->last_name}' joined",
                'type' => 'user_joined'
            ];
        }
        
        return collect($activities)->take(10)->values()->all();
    }
}