<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Editor\ImageUploadController;
use App\Http\Controllers\Wiki\PageController;
use App\Http\Controllers\Wiki\SearchController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Silber\Bouncer\Database\Role;
use App\Http\Controllers\Wiki\RevisionController;

// Public routes;
Route::get('/', [PageController::class, 'home'])->name('home');
Route::prefix('pages')->group(function () {
    Route::get('/{page}/revisions', [RevisionController::class, 'index'])->name('pages.revisions');
    Route::get('/{page}/revisions/{revision}', [RevisionController::class, 'show'])->name('pages.revisions.show');
});

Route::get('/search', [SearchController::class, 'search'])->name('search');
Route::get('/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');
// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Authed search
    Route::get('/search/users', [SearchController::class, 'userList'])->name('search.users');
    Route::get('/search/roles', [SearchController::class, 'roleList'])->name('search.roles');


    // Page creation routes
    Route::prefix('pages')->group(function () {
        Route::get('/create', [PageController::class, 'create'])->name('pages.create'); // Moved above
        Route::post('/', [PageController::class, 'store'])->name('pages.store');
        Route::get('/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
        Route::patch('{page}', [PageController::class, 'update'])->name('pages.update');
        Route::delete('{page}', [PageController::class, 'destroy'])->name('pages.destroy');

        // Abilities
        Route::get('/{page}/abilities', [PageController::class, 'abilities'])->name('pages.abilities');
        Route::post('/{page}/set-restricted', [PageController::class, 'setRestricted'])->name('pages.setRestricted');
        Route::post('/{page}/set-ability', [PageController::class, 'setAbility'])->name('pages.setAbility');
        Route::post('/{page}/delete-ability', [PageController::class, 'deleteAbility'])->name('pages.deleteAbility');

        // Revisions
        Route::patch('/{page}/revisions/{revision}', [RevisionController::class, 'revert'])->name('pages.revisions.revert');
    });

    // Editor routes
    Route::prefix('editor')->group(function () {
        Route::post('image-file-upload', [ImageUploadController::class, 'storeByFile'])->name('editor.storeByFile');
        Route::post('image-url-upload', [ImageUploadController::class, 'storeByUrl'])->name('editor.storeByUrl');
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware('can:view,'.User::class)->name('admin.users.index');
            Route::delete('{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

            // Assign Role
            Route::post('{user}/assign-role', [UserController::class, 'assignRole'])->middleware('can:users.assignRole')->name('admin.users.assignRole');
        });
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->middleware('can:view,'.Role::class)->name('admin.roles.index');
            Route::get('{role}', [RoleController::class, 'show'])->name('admin.roles.show');
            Route::post('{role}/set-ability', [RoleController::class, 'setAbility'])->name('admin.roles.setAbility');
        });
    });
});

Route::get('/pages/{page}', [PageController::class, 'show'])->name('pages.show'); // Moved below

// Include additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
