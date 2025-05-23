<?php

namespace App\Http\Controllers\Wiki;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Page;
use App\Models\PageRevision;

class RevisionController extends Controller
{
    public function index(Request $request, Page $page)
    {
        if ($page->restricted && (auth()->guest() || $request->user()->cannot('view', $page))) {
            abort(403);
        }

        // Fetch all revisions for the given page using the relationship
        $revisions = $page->revisions()->with('user')->orderByDesc('created_at')->get();

        // return response()->json($revisions);

        return Inertia::render('pages/revisions/index', [
            'page' => $page,
            'revisions' => $revisions,
        ]);
    }
    public function show(Request $request, Page $page, PageRevision $revision)
    {
        if ($page->restricted && (auth()->guest() || $request->user()->cannot('view', $page))) {
            abort(403);
        }

        // Check if the revision belongs to the page
        if ($revision->page_id !== $page->id) {
            abort(404);
        }

        return Inertia::render('pages/revisions/show', [
            'page' => $page,
            'revision' => $revision,
        ]);
    }
}
