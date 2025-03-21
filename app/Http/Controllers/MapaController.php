<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Marker;
use Illuminate\Support\Facades\Auth;

class MapaController extends Controller
{
    public function goMapa()
    {
        return view('mapa');
    }

    public function getAdminMarkers()
    {
        // Obtener marcadores del administrador
        $adminMarkers = Marker::where('is_admin', true)->get();
        return response()->json($adminMarkers);
    }

    public function storeUserMarker(Request $request)
    {
        // Validar los datos del marcador
        $validated = $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'icon' => 'required|string',
            'name' => 'required|string',
            'color' => 'required|string',
        ]);

        // Crear un nuevo marcador para el usuario
        $marker = new Marker();
        $marker->lat = $validated['lat'];
        $marker->lon = $validated['lon'];
        $marker->icon = $validated['icon'];
        $marker->name = $validated['name'];
        $marker->color = $validated['color'];
        $marker->user_id = Auth::id();
        $marker->save();

        return response()->json(['success' => true, 'marker' => $marker]);
    }
}
