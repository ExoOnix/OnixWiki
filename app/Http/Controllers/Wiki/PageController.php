<?php

namespace App\Http\Controllers\Wiki;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// Models
use Inertia\Inertia;


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

        $page = Page::create($validated);

        return redirect()->route('pages.show', $page)->with('success', 'Page created successfully!');
    }

    public function show(Request $request, Page $page)
    {
        if ($page->restricted && $request->user()->cannot('view', $page)) {
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
                    'users.view' => $request->user()?->can('users.view'),
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
        if ($request->user()->cannot('update', $page)) {
            abort(403);
        }
        $permissions = DB::table('permissions')
            ->join('abilities', 'permissions.ability_id', '=', 'abilities.id')
            ->where('abilities.entity_type', Page::class)
            ->where('abilities.entity_id', $page->id)
            ->select('permissions.*', 'abilities.name as ability_name', 'abilities.title as ability_title', 'abilities.entity_type as ability_entity_type', 'abilities.scope as ability_scope')
            ->get();


        // return response()->json($permissions, 200);

        return Inertia::render('pages/abilities', [
            'page' => $page,
            'permissions' => $permissions,
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
