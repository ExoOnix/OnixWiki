<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia; // Import the User model
use Silber\Bouncer\Database\Role;
use Silber\Bouncer\Database\Ability;

class RoleController extends Controller
{
    public function index() {
        $roles = Role::withCount('abilities')->get(); // Include permissions count

        return Inertia::render('admin/roles/page', [
            'roles' => $roles,
        ]);
    }
}
