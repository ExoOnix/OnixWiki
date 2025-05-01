<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $writerRole = Role::create(['name' => 'writer']);
        $viewerRole = Role::create(['name' => 'viewer']);

        // Create permissions
        $editPages = Permission::create(['name' => 'edit pages']);
        $viewPages = Permission::create(['name' => 'view pages']);
        $deletePages = Permission::create(['name' => 'delete pages']);
        $createPages = Permission::create(['name' => 'create pages']);
        // Assign permissions to roles
        $adminRole->givePermissionTo([$editPages, $viewPages, $deletePages, $createPages]);
        $writerRole->givePermissionTo([$editPages, $viewPages, $deletePages, $createPages]);
        $viewerRole->givePermissionTo([$viewPages]);

    }
}
