<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\GimcanaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GimcanaGroupController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\CheckpointController;

Route::middleware(['auth'])->group(function () {
    Route::get('/inicio', [AuthController::class, 'showDashboard'])->name('inicio');
    Route::get('/inicioAdmin', [AuthController::class, 'showInicioAdmin'])->name('inicioAdmin');
    Route::get('/mapa', MapaController::class)->name('mapa');
    Route::get('/gimcana', [GimcanaGroupController::class, 'goGimcana'])->name('gimcana');
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
Route::get('/profile', [AuthController::class, 'index'])->name('profile');

// Rutas para el CRUD de usuarios
Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios.index');
Route::get('/admin/usuarios/getUsers', [UserController::class, 'getUsers'])->name('admin.usuarios.getUsers');
Route::get('/admin/usuarios/{id}', [UserController::class, 'show'])->name('admin.usuarios.show');
Route::post('/admin/usuarios/crear', [UserController::class, 'store'])->name('admin.usuarios.store');
Route::post('/admin/usuarios/editar/{id}', [UserController::class, 'update'])->name('admin.usuarios.update');
Route::delete('/admin/usuarios/{id}', [UserController::class, 'destroy'])->name('admin.usuarios.destroy');

// Rutas para el CRUD de gimcanas
Route::get('/admin/gimcanas', [GimcanaController::class, 'index'])->name('admin.gimcanas.index');
Route::get('/admin/gimcanas/getGimcanas', [GimcanaController::class, 'getGimcanas'])->name('admin.gimcanas.getGimcanas');
Route::get('/admin/gimcanas/{id}', [GimcanaController::class, 'show'])->name('admin.gimcanas.show');
Route::post('/admin/gimcanas', [GimcanaController::class, 'store'])->name('admin.gimcanas.store');
Route::get('/admin/gimcanas/editar/{id}', [GimcanaController::class, 'edit'])->name('admin.gimcanas.edit');
Route::put('/admin/gimcanas/{id}', [GimcanaController::class, 'update'])->name('admin.gimcanas.update');
Route::delete('/admin/gimcanas/{id}', [GimcanaController::class, 'destroy'])->name('admin.gimcanas.destroy');
Route::get('/admin/gimcanas/{gimcana}/checkpoints', [GimcanaController::class, 'getCheckpoints'])->name('gimcanas.checkpoints');
Route::get('/admin/gimcanas/checkpoints/recientes', [CheckpointController::class, 'recientes'])->name('admin.gimcanas.checkpoints.recientes');

// Rutas para el CRUD de lugares
Route::get('/admin/places', [PlaceController::class, 'index'])->name('admin.places.index');
Route::get('/admin/places/getPlaces', [PlaceController::class, 'getPlaces'])->name('admin.places.getPlaces');
Route::get('/admin/places/{id}', [PlaceController::class, 'show'])->name('admin.places.show');
Route::post('/admin/places', [PlaceController::class, 'store'])->name('admin.places.store');
Route::put('/admin/places/{id}', [PlaceController::class, 'update'])->name('admin.places.update');
Route::delete('/admin/places/{id}', [PlaceController::class, 'destroy'])->name('admin.places.destroy');
Route::post('/admin/places/{id}/toggle-favorite', [PlaceController::class, 'toggleFavorite'])->name('admin.places.toggleFavorite');
Route::get('/admin/tags', [PlaceController::class, 'getTags'])->name('admin.tags.getTags');

// Rutas para el CRUD de checkpoints
Route::get('/admin/checkpoints', [CheckpointController::class, 'index'])->name('admin.checkpoints.index');
Route::get('/admin/checkpoints/recientes', [CheckpointController::class, 'recientes'])->name('admin.checkpoints.recientes');
Route::post('/admin/checkpoints', [CheckpointController::class, 'store'])->name('admin.checkpoints.store');
Route::get('/admin/checkpoints/{id}', [CheckpointController::class, 'show'])->name('admin.checkpoints.show');
Route::put('/admin/checkpoints/{id}', [CheckpointController::class, 'update'])->name('admin.checkpoints.update');
Route::delete('/admin/checkpoints/{id}', [CheckpointController::class, 'destroy'])->name('admin.checkpoints.destroy');

Route::controller(GimcanaGroupController::class)->group(function () {
    Route::post('/infogimcana', 'infogimcana');
    Route::post('/unirseagrupo', 'unirseagrupo');
    Route::post('/compronargrupousuario', 'compronargrupousuario');
    Route::post('/mostrardatosgrupo', 'mostrardatosgrupo');
    Route::post('/salirgrupo', 'salirgrupo');
    Route::post('/eliminargrupo', 'eliminargrupo');
    Route::post('/expulsargrupo', 'expulsargrupo');
    Route::post('/creargrupo', 'creargrupo');
});

// Rutas para favoritos
Route::middleware(['auth'])->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/toggle/{placeId}', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    Route::get('/favorites/check/{placeId}', [FavoriteController::class, 'isFavorite'])->name('favorites.check');
    Route::get('/favorites/list', [FavoriteController::class, 'getFavorites'])->name('favorites.list');
    Route::get('/places/search', [PlaceController::class, 'search'])->name('places.search');
});
Route::get('/admin/places/{id}/edit', [PlaceController::class, 'edit']);

// Rutas para el CRUD de categorías
Route::get('/admin/categories', [CategoryController::class, 'index']);
Route::get('/admin/groups', [GimcanaGroupController::class, 'getGroups']);
Route::get('/admin/checkpoints', [CheckpointController::class, 'getAllCheckpoints']);
Route::post('/cargagimcanas', [GimcanaGroupController::class, 'cargagimcanas']);
