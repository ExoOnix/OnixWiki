<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Import the User model

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(14);

        return Inertia::render('admin/user/page', [
            'users' => $users, // Pass users to the view
        ]);
    }
    public function destroy(Request $request, User $user) {
        if ($request->user()->cannot('delete', $user)) {
            abort(403);
        }

        $user->delete();
        return redirect()->back()->with('success', 'Your action was successful!');
    }
}
