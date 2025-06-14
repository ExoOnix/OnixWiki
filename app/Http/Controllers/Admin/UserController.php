<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\User;
use Bouncer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Silber\Bouncer\Database\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::select('id', 'name', 'email', 'created_at')
            ->with('roles:title') // Include roles with only the title field
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        $roles = Role::all();

        return Inertia::render('admin/users/page', [
            'users' => $users,
            'roles' => $roles,
            'auth' => [
                'user' => $request->user(),
                'can' => [
                    'assign-role' => $request->user()->can('users.assignRole'),
                    'delete-user' => $request->user()->can('delete', User::class),
                    'create-pages' => $request->user()?->can('create', Page::class),
                    'users.view' => $request->user()?->can('view', User::class),
                    'roles.view' => $request->user()?->can('view', Role::class),
                ],
            ],
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->cannot('delete', $user)) {
            abort(403);
        }

        $user->delete();

        return redirect()->back()->with('success', 'Your action was successful!');
    }

    public function assignRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'nullable|exists:roles,id',
        ]);

        $roleId = $validated['role_id'] ?? null; // Ensure role_id exists

        if (is_null($roleId)) {
            Bouncer::sync($user)->roles([]);
        } else {
            $role = Role::findOrFail($roleId);
            Bouncer::sync($user)->roles([$role]);
        }

        return redirect()->back()->with('success', 'Your action was successful!');
    }
}
