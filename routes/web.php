<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Editor\ImageUploadController;
use App\Http\Controllers\Wiki\PageController;
use App\Http\Controllers\Wiki\SearchController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RoleController;
use App\Models\User;
use Silber\Bouncer\Database\Role;

// Public routes;
Route::get('/', [PageController::class, 'home'])->name('home');

Route::get('/search', [SearchController::class, 'search'])->name('search');
Route::get('/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Page creation routes
    Route::prefix('pages')->group(function () {
        Route::get('/create', [PageController::class, 'create'])->name('pages.create'); // Moved above
        Route::post('/', [PageController::class, 'store'])->name('pages.store');
        Route::get('/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
        Route::patch('{page}', [PageController::class, 'update'])->name('pages.update');
        Route::delete('{page}', [PageController::class, 'destroy'])->name('pages.destroy');

        // Abilities
        Route::get('/{page}/abilities', [PageController::class, 'abilities'])->name('pages.abilities');
    });

    // Editor routes
    Route::prefix('editor')->group(function () {
        Route::post('image-file-upload', [ImageUploadController::class, 'storeByFile'])->name('editor.storeByFile');
        Route::post('image-url-upload', [ImageUploadController::class, 'storeByUrl'])->name('editor.storeByUrl');
    });

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware('can:view,' . User::class)->name('admin.users.index');
            Route::delete('{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');

            // Assign Role
            Route::post('{user}/assign-role', [UserController::class, 'assignRole'])->middleware('can:users.assignRole')->name('admin.users.assignRole');
        });
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->middleware('can:view,' . Role::class)->name('admin.roles.index');
            Route::get('{role}', [RoleController::class, 'show'])->name('admin.roles.show');
            Route::post('{role}/set-ability', [RoleController::class, 'setAbility'])->name('admin.roles.setAbility');
        });
    });
});

Route::get('/pages/{page}', [PageController::class, 'show'])->name('pages.show'); // Moved below

// Include additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
