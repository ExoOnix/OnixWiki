<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\User;
use Bouncer;
use Illuminate\Database\Seeder;

class BouncerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bouncer::allow('superadmin')->everything();

        Bouncer::allow('admin')->everything();
        Bouncer::forbid('admin')->toManage(User::class);
        Bouncer::forbid('admin')->to('users.view');

        Bouncer::allow('writer')->toManage(Page::class);
    }
}
