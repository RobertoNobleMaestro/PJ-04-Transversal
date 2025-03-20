<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller{
    public function showLoginForm(){
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        // Intentar autenticar al usuario
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            
            // Regenerar la sesión
            $request->session()->regenerate();

            // Guardar el ID y nombre del usuario en la sesión
            session(['id' => $user->id]);
            session(['nombre' => $user->nombre]);

            // Redirigir según el rol
            if ($user->rol_id == 1) {
                return redirect()->intended('/admin');
            } elseif ($user->rol_id == 2) {
                return redirect()->intended('/inicio');
            }
        }
    
        // Si las credenciales no coinciden, devolver el error
        return back()->withErrors([
            'email' => 'Las credenciales no coinciden con nuestros registros.',
        ]);
    }
    

    public function showRegisterForm(){
        return view('auth.register');
    }

public function register(Request $request)
{
    $request->validate([
        'name' => 'required|unique:users,nombre',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|confirmed', // Cambiado de 'contra' a 'password'
    ]);

    $user = User::create([
        'name' => $request->nombre,
        'email' => $request->email,
        'password' => Hash::make($request->password), // Cambiado de 'contra' a 'password'
        'role_id' => 2, 
    ]);

    Auth::login($user);
    return redirect('/inicio');
}
    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
