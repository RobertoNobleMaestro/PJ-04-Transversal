<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return view('admin.usuarios.index', compact('roles'));
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
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            // Depuración: Verifica que el usuario tenga el campo 'name'
            // dd($user);

            return response()->json($user);
        } catch (\Exception $e) {
            // Log del error
            \Log::error('Error en UserController@show: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id', // Asegura que el rol existe
        ]);
    
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $request->role_id,
        ]);
    
        return response()->json(['message' => 'Usuario creado con éxito'], 201);
    }
    

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->update($request->all());

        return response()->json($user);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    // Obtener todos los roles para filtros
    public function getRoles()
    {
        $roles = Role::all();
        return response()->json($roles);
    }
}