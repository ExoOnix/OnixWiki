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
        // Superadmin
        // Users
        Bouncer::allow('superadmin')->to('create', User::class);
        Bouncer::allow('superadmin')->to('update', User::class);
        Bouncer::allow('superadmin')->to('delete', User::class);
        Bouncer::allow('superadmin')->to('view', User::class);

        // Pages
        Bouncer::allow('superadmin')->to('create', Page::class);
        Bouncer::allow('superadmin')->to('update', Page::class);
        Bouncer::allow('superadmin')->to('delete', Page::class);
        Bouncer::allow('superadmin')->to('view', Page::class);

        // Roles
        Bouncer::allow('superadmin')->to('create', Role::class);
        Bouncer::allow('superadmin')->to('update', Role::class);
        Bouncer::allow('superadmin')->to('delete', Role::class);
        Bouncer::allow('superadmin')->to('view', Role::class);
        Bouncer::allow('superadmin')->to('users.assignRole');

        // ADMIN
        // Pages
        Bouncer::allow('admin')->to('create', Page::class);
        Bouncer::allow('admin')->to('update', Page::class);
        Bouncer::allow('admin')->to('delete', Page::class);
        Bouncer::allow('admin')->to('view', Page::class);

        // Writer
        // Pages
        Bouncer::allow('writer')->to('create', Page::class);
        Bouncer::allow('writer')->to('update', Page::class);
        Bouncer::allow('writer')->to('delete', Page::class);
        Bouncer::allow('writer')->to('view', Page::class);
    }
}
