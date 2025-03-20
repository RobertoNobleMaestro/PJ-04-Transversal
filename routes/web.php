<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\GimcanaController;
use App\Http\Controllers\UserController;


Route::middleware(['auth'])->group(function () {
    Route::get('/inicio', [AuthController::class, 'showDashboard'])->name('inicio');
    Route::get('/mapa', [MapaController::class, 'goMapa'])->name('mapa');
    Route::get('/gimcana', [GimcanaController::class, 'goGimcana'])->name('gimcana');

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

// Rutas para el CRUD de usuarios
Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios.index');
Route::get('/admin/usuarios/getUsers', [UserController::class, 'getUsers'])->name('admin.usuarios.getUsers');
Route::get('/admin/usuarios/{id}', [UserController::class, 'show'])->name('admin.usuarios.show');
Route::post('/admin/usuarios', [UserController::class, 'store'])->name('admin.usuarios.store');
Route::put('/admin/usuarios/{id}', [UserController::class, 'update'])->name('admin.usuarios.update');
Route::delete('/admin/usuarios/{id}', [UserController::class, 'destroy'])->name('admin.usuarios.destroy');
Route::get('/admin/usuarios/Roles', [UserController::class, 'Roles']);

// Rutas para el CRUD de gimcanas
Route::get('/admin/gimcanas', [GimcanaController::class, 'index'])->name('admin.gimcanas.index');
Route::get('/admin/gimcanas/{id}', [GimcanaController::class, 'show'])->name('admin.gimcanas.show');
Route::post('/admin/gimcanas', [GimcanaController::class, 'store'])->name('admin.gimcanas.store');
Route::put('/admin/gimcanas/{id}', [GimcanaController::class, 'update'])->name('admin.gimcanas.update');
Route::delete('/admin/gimcanas/{id}', [GimcanaController::class, 'destroy'])->name('admin.gimcanas.destroy');
