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
        return Inertia::render('create/page');
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $page = Page::create($validated);

        return redirect()->route('home')->with('success', 'Page created successfully!');
    }
    public function show(Page $page)
    {
        return Inertia::render('wiki/show', [
            'page' => $page,
        ]);
    }
}
