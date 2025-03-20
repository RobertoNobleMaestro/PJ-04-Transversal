<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Listar todos los usuarios
    public function index()
    {
        return view('admin.usuarios.index'); // Devuelve la vista
    }

    // Obtener usuarios en formato JSON (para AJAX)
    public function getUsers()
    {
        $users = User::with('role')->get(); // Cargar usuarios con su rol
        return response()->json($users);
    }

    // Mostrar un usuario específico
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id', // Asegúrate de que el role_id esté presente y sea válido
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id, // Incluye el role_id
        ]);

        return response()->json($user, 201);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }

    // Obtener roles en formato JSON (para AJAX)
    public function getRoles()
    {
        $roles = Role::all(); // Obtener todos los roles
        return response()->json($roles); // Devolver los roles en formato JSON
    }
}