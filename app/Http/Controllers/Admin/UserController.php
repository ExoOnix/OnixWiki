<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia; // Import the User model

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'created_at')
            ->with('roles:name') // Include roles with only the name field
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('admin/user/page', [
            'users' => $users, // Pass users to the view
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
}
