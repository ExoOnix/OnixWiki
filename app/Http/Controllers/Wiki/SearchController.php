<?php

namespace App\Http\Controllers\Wiki;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Page;


class SearchController extends Controller
{
    public function search(Request $request) {
        $pages = Page::search($request->search)->take(15)->get();

        return Inertia::render('search', [
            'results' => $pages,
        ]);
    }

    public function suggestions(Request $request) {
        $titles = Page::search($request->search)->take(5)->get()->pluck('title');

        return response()->json([
            'suggestions' => $titles,
        ]);
    }
}
