<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }
    public function index()
    {
        $user = Auth::user();
        return view('profile.index', compact('user'));
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
            
            $request->session()->regenerate();

            session(['id' => $user->id]);
            session(['nombre' => $user->name]); 

            if ($user->role_id == 1) { 
                return redirect()->route('admin.gimcanas.index');
            } elseif ($user->role_id == 2) { 
                return redirect()->intended('/mapa');
            }

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
            'name' => 'required|unique:users,name', 
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name, 
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => 2, 
        ]);

        Auth::login($user);

        return redirect('/mapa');
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
