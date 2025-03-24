<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index()
    {
        return view('admin.places.index');
    }

    public function getPlaces()
    {
        $places = Place::with(['category', 'tags'])->get();
        return response()->json($places->map(function($place) {
            return [
                'id' => $place->id,
                'nombre' => $place->nombre,
                'categoria' => $place->category ? ['nombre' => $place->category->nombre] : null,
                'etiquetas' => $place->tags->pluck('nombre')->toArray()
            ];
        }));
    }

    public function show($id)
    {
        $place = Place::with(['category', 'tags'])->findOrFail($id);
        return response()->json($place);
    }

    public function destroy($id)
    {
        $place = Place::findOrFail($id);
        $place->delete();
        return response()->json(null, 204);
    }
}
