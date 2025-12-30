<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Corporate;
use App\Traits\ApiResponse;

class SuperAdminDashboardController extends Controller
{
    use ApiResponse;

    public function dashboard()
    {
        $stats = [
            'total_organizations' => Corporate::count(),
            'active_organizations' => Corporate::where('status', 'active')->count(),
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'total_revenue' => Corporate::sum('last_payment_amount') ?? 0,
            'monthly_revenue' => Corporate::whereMonth('last_payment_date', now()->month)
                ->whereYear('last_payment_date', now()->year)
                ->sum('last_payment_amount') ?? 0,
            'recent_activities' => $this->getSuperAdminRecentActivities(),
            'quick_actions' => $this->getSuperAdminQuickActions()
        ];

        return $this->successResponse($stats, 'Super admin dashboard data retrieved');
    }

    private function getSuperAdminRecentActivities()
    {
        $activities = [];
        
        $recentOrgs = Corporate::latest()->take(3)->get();
        foreach ($recentOrgs as $org) {
            $activities[] = [
                'time' => $org->created_at->diffForHumans(),
                'text' => "New organization '{$org->name}' registered",
                'type' => 'organization_created'
            ];
        }
        
        $recentUsers = User::latest()->take(3)->get();
        foreach ($recentUsers as $user) {
            $activities[] = [
                'time' => $user->created_at->diffForHumans(),
                'text' => "New user '{$user->name}' added",
                'type' => 'user_created'
            ];
        }
        
        return collect($activities)->sortByDesc('time')->take(8)->values()->all();
    }
    
    private function getSuperAdminQuickActions()
    {
        $user = auth()->user();
        
        $quickActionsSetting = $user->settings()->where('key', 'quick_actions')->first();
        
        if ($quickActionsSetting) {
            $quickActions = json_decode($quickActionsSetting->value, true);
            return array_filter($quickActions, function($action) {
                return $action['enabled'] ?? false;
            });
        }
        
        return [
            ['id' => 'organizations', 'label' => 'Manage Organizations', 'url' => '/organizations', 'type' => 'primary'],
            ['id' => 'settings', 'label' => 'System Settings', 'url' => '/settings', 'type' => 'secondary'],
        ];
    }
}