<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Wiki\PageController;

Route::get('/', [PageController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('create')->group(function () {
        Route::get('/page', [PageController::class, 'create'])->name('create.page');
        Route::post('/page', [PageController::class, 'store'])->name('store.page');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
