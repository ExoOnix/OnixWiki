<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia; // Import the User model
use Silber\Bouncer\Database\Role;
use Silber\Bouncer\Database\Ability;
use App\Models\User;
use App\Models\Page;

use Bouncer;
class RoleController extends Controller
{
    public function index() {
        $roles = Role::withCount('abilities')->get(); // Include permissions count

        return Inertia::render('admin/roles/page', [
            'roles' => $roles,
        ]);
    }
    public function show(Request $request, Role $role)
    {
        if ($request->user()->cannot('view', $role)) {
            abort(403);
        }

        // Load only the assigned abilities
        $role->load('abilities');
        $assignedIds = $role->abilities->pluck('id')->toArray();

        // Build the full ability list with isAssigned
        $allAbilities = Ability::all()->map(function ($ability) use ($assignedIds) {
            $ability->isAssigned = in_array($ability->id, $assignedIds);
            return $ability;
        });

        // Convert role to array to customize the response structure
        $roleArray = $role->toArray();
        $roleArray['abilities'] = $allAbilities;

        return Inertia::render('admin/roles/show', [
            'role' => $roleArray,
            'auth' => [
                'user' => $request->user(),
                'can' => [
                    'update-role' => $request->user()->can('update', Role::class),
                    'create-pages' => $request->user()?->can('create', Page::class),
                    'users.view' => $request->user()?->can('view', User::class),
                    'roles.view' => $request->user()?->can('view', Role::class),
                ],
            ],
        ]);
    }
    public function setAbility(Request $request, Role $role) {
        if ($request->user()->cannot('update', $role)) {
            abort(403);
        }

        $validated = $request->validate([
            'ability' => 'required|exists:abilities,id',
            'allow' => 'required|boolean',
        ]);

        if ($validated['allow']) {
            Bouncer::allow($role)->to($validated['ability']);
        } else {
            Bouncer::disallow($role)->to($validated['ability']);
        }
    }
}
