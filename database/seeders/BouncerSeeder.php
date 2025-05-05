<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Page;
use Bouncer;

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
        Bouncer::forbid('admin')->to('roles.view');

        Bouncer::allow('writer')->toManage(Page::class);
    }
}
