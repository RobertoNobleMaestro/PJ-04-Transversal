<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::middleware(['auth'])->group(function () {
    Route::get('/mapa', [AuthController::class, 'goMapa'])->name('mapa');
    Route::get('/gimcana', [AuthController::class, 'goGimcana'])->name('gimcana');

});
Route::get('/', [AuthController::class, 'showHome']); 


Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::get('/index', [AuthController::class, 'showHome'])->name('index');
