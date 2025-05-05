<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Wiki\PageController;
use App\Http\Controllers\Editor\ImageUploadController;
use App\Http\Controllers\Wiki\SearchController;
use App\Http\Controllers\Admin\AdminController;
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
    });

    // Editor routes
    Route::prefix('editor')->group(function () {
        Route::post('image-file-upload', [ImageUploadController::class, 'storeByFile'])->name('editor.storeByFile');
        Route::post('image-url-upload', [ImageUploadController::class, 'storeByUrl'])->name('editor.storeByUrl');
    });

    // Admin routes
    Route::middleware('can:access-admin')->prefix('admin')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    });
});

Route::get('/pages/{page}', [PageController::class, 'show'])->name('pages.show'); // Moved below

// Include additional route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
