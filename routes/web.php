<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Wiki\PageController;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/wiki/{page}', [PageController::class, 'show'])->name('wiki.page');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('create')->group(function () {
        Route::get('/page', [PageController::class, 'create'])->name('create.page');
        Route::post('/page', [PageController::class, 'store'])->name('store.page');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
