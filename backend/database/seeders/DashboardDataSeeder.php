<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Corporate;
use App\Models\User;
use App\Models\Module;
use Illuminate\Support\Facades\Hash;

class DashboardDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create test corporates
        $corporate1 = Corporate::create([
            'name' => 'Tech Corp',
            'slug' => 'tech-corp',
            'email' => 'admin@techcorp.com',
            'is_active' => true,
        ]);

        $corporate2 = Corporate::create([
            'name' => 'Business Solutions',
            'slug' => 'business-solutions',
            'email' => 'admin@bizsolve.com',
            'is_active' => true,
        ]);

        // Create test users
        User::create([
            'name' => 'Corporate Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'corporate_id' => $corporate1->id,
            'user_type' => 'corporate_admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Employee User',
            'email' => 'employee@example.com',
            'password' => Hash::make('employee123'),
            'corporate_id' => $corporate1->id,
            'user_type' => 'employee',
            'is_active' => true,
        ]);

        // Create test modules
        Module::create([
            'name' => 'Project Management',
            'slug' => 'project-management',
            'description' => 'Manage projects and tasks',
            'is_core' => true,
            'is_active' => true,
        ]);

        Module::create([
            'name' => 'User Management',
            'slug' => 'user-management',
            'description' => 'Manage users and permissions',
            'is_core' => true,
            'is_active' => true,
        ]);
    }
}