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

    public function infogimcana()
    {
        $grupos = Group::with('creador')->get();
        $usuarios = User::all();
        $user = Auth::user();
        return response()->json(['grupos' => $grupos, 'usuarios' => $usuarios, 'user' => $user]);
    }
}
