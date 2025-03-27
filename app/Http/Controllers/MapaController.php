<?php

namespace App\Http\Controllers;

use App\Models\Place;
use App\Models\Category;

class MapaController extends Controller
{
    public function __invoke()
    {
        $places = Place::with('category')->get();
        $categories = Category::all();
        return view('mapa', compact('places', 'categories'));
    }
}