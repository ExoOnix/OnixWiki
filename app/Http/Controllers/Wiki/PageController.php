<?php

namespace App\Http\Controllers\Wiki;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Page;

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
    public function create()
    {
        return Inertia::render('pages/create');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $page = Page::create($validated);

        return redirect()->route('pages.show', $page)->with('success', 'Page created successfully!');
    }
    public function show(Page $page)
    {
        return Inertia::render('pages/show', [
            'page' => $page,
        ]);
    }
    public function edit(Page $page)
    {
        return Inertia::render('pages/edit', [
            'page' => $page,
        ]);
    }
    public function update(Request $request, Page $page) {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $page->update($validated);

        return redirect()->route('pages.show', $page)->with('success', 'Page created successfully!');
    }
    public function destroy(Request $request, Page $page) {
        $page->delete();
        return redirect()->route('home')->with('success', 'Your action was successful!');
    }
}
