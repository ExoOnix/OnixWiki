<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Bouncer;
use Illuminate\Database\Seeder;
use Silber\Bouncer\Database\Role;

class BouncerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bouncer::allow('superadmin')->everything();

        // ADMIN
        Bouncer::allow('admin')->everything();
        // ADMIN Users
        Bouncer::forbid('admin')->toManage(User::class);
        Bouncer::forbid('admin')->to('users.assignRole');
        // ADMIN Roles
        Bouncer::forbid('admin')->toManage(Role::class);


        Bouncer::allow('writer')->toManage(Page::class);
    }
}
