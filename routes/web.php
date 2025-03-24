<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\GimcanaController;
use App\Http\Controllers\LugarInteresController;

// Rutas públicas
Route::get('/', [AuthController::class, 'showHome'])->name('index');  // Añadido name('index')
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas por autenticación
Route::middleware(['auth'])->group(function () {
    Route::get('/inicio', [AuthController::class, 'showDashboard'])->name('inicio');
    Route::get('/mapa', MapaController::class)->name('mapa');
    Route::get('/gimcana', [GimcanaController::class, 'goGimcana'])->name('gimcana');
    Route::get('/profile', [AuthController::class, 'index'])->name('profile');
    Route::get('/lugares', [LugarInteresController::class, 'index'])->name('lugares');
    Route::get('/admin-markers', [MapaController::class, 'getAdminMarkers'])->name('admin.markers');
    Route::post('/user-markers', [MapaController::class, 'storeUserMarker'])->name('user.markers.store');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

