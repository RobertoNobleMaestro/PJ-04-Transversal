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
                'descripcion' => $place->descripcion,
                'direccion' => $place->direccion,
                'coordenadas_lat' => $place->coordenadas_lat,
                'coordenadas_lon' => $place->coordenadas_lon,
                'categoria' => $place->category ? ['nombre' => $place->category->nombre] : null,
                'etiquetas' => $place->tags->pluck('nombre')->toArray(),
                'favorito' => $place->favorito,
                'imagen' => $place->imagen
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
        
        return response()->json(['success' => true]);
    }
    
    /**
     * Search for places by name or category
     */
    public function search(Request $request)
    {
        $query = $request->input('query', '');
        
        // Registrar la consulta para depuración
        \Log::info('Búsqueda de lugares con query: ' . $query);
        
        // Si la consulta está vacía, devolver todos los lugares (limitados)
        if (empty($query)) {
            $places = Place::with('category')->limit(10)->get();
            \Log::info('Búsqueda vacía, devolviendo todos los lugares: ' . $places->count());
            return response()->json(['places' => $places]);
        }
        
        // Usar una consulta más flexible
        $places = Place::with('category')
            ->where(function($q) use ($query) {
                $q->where('nombre', 'LIKE', "%{$query}%")
                  ->orWhere('descripcion', 'LIKE', "%{$query}%")
                  ->orWhere('direccion', 'LIKE', "%{$query}%");
            })
            ->orWhereHas('category', function($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%");
            })
            ->limit(20)
            ->get();
        
        // Registrar resultados para depuración
        \Log::info('Resultados encontrados: ' . $places->count());
        
        // Si no hay resultados, intentar una búsqueda más amplia
        if ($places->isEmpty()) {
            // Intentar con una búsqueda más amplia (solo buscar por parte de la palabra)
            $words = explode(' ', $query);
            $places = Place::with('category')
                ->where(function($q) use ($words) {
                    foreach ($words as $word) {
                        if (strlen($word) > 3) { // Solo palabras con más de 3 caracteres
                            $q->orWhere('nombre', 'LIKE', "%{$word}%")
                              ->orWhere('descripcion', 'LIKE', "%{$word}%")
                              ->orWhere('direccion', 'LIKE', "%{$word}%");
                        }
                    }
                })
                ->limit(20)
                ->get();
                
            \Log::info('Resultados con búsqueda ampliada: ' . $places->count());
        }
            
        return response()->json(['places' => $places]);
    }
}
