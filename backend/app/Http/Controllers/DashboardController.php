<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Corporate;
use App\Traits\ApiResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function superAdminStats()
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
            'recent_activities' => $this->getRecentActivities(),
            'quick_actions' => $this->getQuickActions()
        ];

        return $this->successResponse($stats, 'Super admin dashboard data retrieved');
    }

    private function getRecentActivities()
    {
        $activities = [];
        
        // Recent organizations
        $recentOrgs = Corporate::latest()->take(2)->get();
        foreach ($recentOrgs as $org) {
            $activities[] = [
                'time' => $org->created_at->diffForHumans(),
                'text' => "New organization '{$org->name}' registered"
            ];
        }
        
        // Recent users
        $recentUsers = User::latest()->take(2)->get();
        foreach ($recentUsers as $user) {
            $activities[] = [
                'time' => $user->created_at->diffForHumans(),
                'text' => "New user '{$user->name}' added"
            ];
        }
        
        // Recent payments
        $recentPayments = Corporate::whereNotNull('last_payment_date')
            ->orderBy('last_payment_date', 'desc')
            ->take(2)
            ->get();
        foreach ($recentPayments as $payment) {
            $activities[] = [
                'time' => $payment->last_payment_date->diffForHumans(),
                'text' => "Payment received from {$payment->name}"
            ];
        }
        
        return collect($activities)->sortByDesc('time')->take(5)->values()->all();
    }
    
    private function getQuickActions()
    {
        $user = auth()->user();
        
        // Get quick actions from user settings
        $quickActionsSetting = $user->settings()->where('key', 'quick_actions')->first();
        
        if ($quickActionsSetting) {
            $quickActions = json_decode($quickActionsSetting->value, true);
            // Filter only enabled actions
            return array_filter($quickActions, function($action) {
                return $action['enabled'] ?? false;
            });
        }
        
        // Default quick actions if not configured
        return [
            ['id' => 'organizations', 'label' => 'Manage Organizations', 'url' => '/organizations', 'type' => 'primary'],
            ['id' => 'settings', 'label' => 'System Settings', 'url' => '/settings', 'type' => ''],
            ['id' => 'reports', 'label' => 'Generate Reports', 'url' => '#', 'type' => ''],
            ['id' => 'backup', 'label' => 'Backup System', 'url' => '#', 'type' => '']
        ];
    }

    public function adminStats(Request $request)
    {
        $user = auth()->user();
        $corporateId = $user->corporate_id;
        $corporate = Corporate::find($corporateId);

        $stats = [
            'team_members' => User::where('corporate_id', $corporateId)->count(),
            'organization_info' => $corporate,
            'recent_activities' => $this->getCorporateRecentActivities($corporateId),
            'user_roles' => User::where('corporate_id', $corporateId)
                ->selectRaw('role_id, COUNT(*) as count')
                ->groupBy('role_id')
                ->get(),
        ];

        return $this->successResponse($stats, 'Admin dashboard data retrieved');
    }
    
    private function getCorporateRecentActivities($corporateId)
    {
        $activities = [];
        
        // Recent users in this corporate
        $recentUsers = User::where('corporate_id', $corporateId)
            ->latest()
            ->take(3)
            ->get();
        
        foreach ($recentUsers as $user) {
            $activities[] = [
                'time' => $user->created_at->diffForHumans(),
                'text' => "User '{$user->first_name} {$user->last_name}' joined"
            ];
        }
        
        return collect($activities)->take(5)->values()->all();
    }
}