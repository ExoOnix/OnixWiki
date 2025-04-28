<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Wiki\PageController;

// Public routes;
Route::get('/', [PageController::class, 'home'])->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Page creation routes
    Route::prefix('pages')->group(function () {
        Route::get('/create', [PageController::class, 'create'])->name('pages.create'); // Moved above
        Route::post('/', [PageController::class, 'store'])->name('pages.store');
        Route::get('/{page}/edit', [PageController::class, 'edit'])->name('pages.edit');
        Route::patch('{page}', [PageController::class, 'update'])->name('pages.update');
    });
});

Route::get('/pages/{page}', [PageController::class, 'show'])->name('pages.show'); // Moved below

// Include additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
