<?php

namespace App\Http\Controllers\Wiki;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
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
}
