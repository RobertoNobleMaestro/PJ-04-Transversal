<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GimcanaController extends Controller
{
    public function goGimcana()
    {
        $grupos = Group::with('creador')->get();
        $usuarios = User::all();
        $user = Auth::user();
        return view('gimcana', compact('grupos', 'usuarios', 'user'));
    }

    public function infogimcana(Request $request)
    {
        $grupos = Group::with('creador');



        if ($request->creador) {
            $creador = $request->creador;
            $grupos->whereHas('creador', function ($query) use ($creador) {
                $query->where('name', 'like', "%$creador%");
            });
        }

        if ($request->codigo) {
            $codigo = $request->codigo;
            $grupos->where('codigogrupo', '=', "$codigo");
        }

        if (isset($request->codigo) || isset($request->creador)) {
            $grupos->where('miembros', '>=', "0");
        } else {
            $grupos->where('miembros', '>', "0");
        }

        $grupos = $grupos->get();

        $usuarios = User::all();
        $user = Auth::user();
        return response()->json(['grupos' => $grupos, 'usuarios' => $usuarios, 'user' => $user]);
    }

    public function unirseagrupo()
    {
        $grupos = Group::with('creador')->get();
        $usuarios = User::all();
        $user = Auth::user();
        return view('gimcana', compact('grupos', 'usuarios', 'user'));
    }
}
