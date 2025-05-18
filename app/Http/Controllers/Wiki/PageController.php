<?php

namespace App\Http\Controllers\Wiki;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Models
use Inertia\Inertia;
use Silber\Bouncer\Database\Ability;
use App\Models\User;
use Silber\Bouncer\Database\Role;
class PageController extends Controller
{
    public function home()
    {
        $homepage = Page::where('slug', 'home')->first();
        if ($homepage) {
            return Inertia::render('home', [
                'page' => $homepage,
            ]);
        }

        return Inertia::render('home');
    }

    public function create(Request $request)
    {
        if ($request->user()->cannot('create', Page::class)) {
            abort(403);
        }

        return Inertia::render('pages/create');
    }

    public function store(Request $request)
    {
        if ($request->user()->cannot('create', Page::class)) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $page = Page::create(array_merge($validated, ['restricted' => false]));

        return redirect()->route('pages.show', $page)->with('success', 'Page created successfully!');
    }

    public function show(Request $request, Page $page)
    {
        if ($page->restricted && (auth()->guest() || $request->user()->cannot('view', $page))) {
            abort(403);
        }


        return Inertia::render('pages/show', [
            'page' => $page,
            'auth' => [
                'user' => $request->user(),
                'can' => [
                    'edit-pages' => $request->user()?->can('update', $page),
                    'delete-pages' => $request->user()?->can('delete', $page),
                    'create-pages' => $request->user()?->can('create', Page::class),
                    'users.view' => $request->user()?->can('view', User::class),
                    'roles.view' => $request->user()?->can('view', Role::class),
                ],
            ],
        ]);
    }

    public function edit(Request $request, Page $page)
    {
        if ($request->user()->cannot('update', $page)) {
            abort(403);
        }

        return Inertia::render('pages/edit', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, Page $page)
    {
        if ($request->user()->cannot('update', $page)) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $page->update($validated);

        return redirect()->route('pages.show', $page)->with('success', 'Page created successfully!');
    }

    public function destroy(Request $request, Page $page)
    {
        if ($request->user()->cannot('delete', $page)) {
            abort(403);
        }

        $page->delete();

        return redirect()->route('home')->with('success', 'Your action was successful!');
    }

    // Abilites
    public function abilities(Request $request, Page $page)
    {
        // Check if the user has permission to update the page
        if ($request->user()->cannot('update', $page)) {
            abort(403);
        }

        // Initialize an empty array to store permissions
        $permissions = [];

        // Retrieve all abilities associated with the Page model
        $abilities = Ability::where('entity_type', Page::class)
            ->where('entity_id', $page->id)
            ->get();

        // Iterate through each ability
        foreach ($abilities as $ability) {
            // Fetch assignments from the permissions table
            $assignments = DB::table('permissions')
                ->where('ability_id', $ability->id)
                ->get();

            // Process each assignment
            foreach ($assignments as $assignment) {
                $entityType = $assignment->entity_type;
                $entityId = $assignment->entity_id;
                $forbidden = $assignment->forbidden;

                // Determine if the assignment is to a user or role
                if ($entityType === 'App\\Models\\User') {
                    $targetInfo = User::find($entityId);
                } elseif ($entityType === 'roles') {
                    $targetInfo = Role::find($entityId);
                }

                // Append the permission details to the array
                $permissions[] = [
                    'ability_name' => $ability->name,
                    'ability_id' => $ability->id,
                    'target_type' => $entityType,
                    'target_info' => $targetInfo,
                    'forbidden' => $forbidden,
                ];
            }
        }

        // Return the permissions as a JSON response
        // return response()->json($permissions, 200);

        return Inertia::render('pages/abilities', [
            'page' => $page,
            'permissions' => $permissions,
            'roles' => Role::all(),
            'users' => User::all(),
        ]);
    }

    public function setRestricted(Request $request, Page $page)
    {
        if ($request->user()->cannot('update', $page)) {
            abort(403);
        }

        $validated = $request->validate([
            'restricted' => 'required|boolean',
        ]);

        $page->update($validated);

        return redirect()->back()->with('success', 'Your action was successful!');
    }
}
