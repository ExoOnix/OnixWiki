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
    public function show(Request $request, Role $role) {
        if ($request->user()->cannot('view', $role)) {
            abort(403);
        }

        $role->load('abilities'); // Eager load the permissions for the role

        return Inertia::render('admin/roles/show', [
            'role' => $role,
        ]);
    }
}
