<?php

namespace App\Http\Controllers;

use App\Models\Place;

class MapaController extends Controller
{
    public function __invoke()
    {
        $places = Place::with('category')->get();
        return view('mapa', compact('places'));
    }
}