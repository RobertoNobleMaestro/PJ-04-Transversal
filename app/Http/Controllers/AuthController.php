<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Mostrar formulario de login
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // Página principal después de login
    public function showHome()
    {
        return view('index');
    }
    public function showDashboard()
    {
        return view('cliente.inicio');
    }
    
    // Método para procesar el login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        // Intentar autenticar al usuario
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            
            // Regenerar la sesión para mayor seguridad
            $request->session()->regenerate();

            // Guardar el ID y nombre del usuario en la sesión
            session(['id' => $user->id]);
            session(['nombre' => $user->name]); // Asegúrate de que el campo sea 'name', no 'nombre'

            // Redirigir según el rol
            if ($user->role_id == 1) { // Si el rol es 1, admin
                return redirect()->intended('/admin');
            } elseif ($user->role_id == 2) { // Si el rol es 2, usuario normal
                return redirect()->intended('/inicio');
            }

            // Si el usuario no tiene rol asignado, redirigir a la página principal
            return redirect('/');
        }
    
        // Si las credenciales no coinciden, mostrar error
        return back()->withErrors([
            'email' => 'Las credenciales no coinciden con nuestros registros.',
        ]);
    }

    // Mostrar formulario de registro
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    // Método para registrar un nuevo usuario
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:users,name', // Asegúrate de que el campo sea 'name', no 'nombre'
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        // Crear un nuevo usuario
        $user = User::create([
            'name' => $request->name, // Asegúrate de que el campo sea 'name', no 'nombre'
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 2, // Asignamos el rol de usuario normal
        ]);

        // Autenticar al usuario recién creado
        Auth::login($user);

        // Redirigir al usuario a la página de inicio
        return redirect('/inicio');
    }

    // Método para logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
