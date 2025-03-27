<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PlaceController extends Controller
{
    public function index()
    {
        return view('admin.places.index');
    }

    public function getPlaces(Request $request)
    {
        $query = Place::with('category');
        
        // Filtro por nombre
        if ($request->has('nombre') && !empty($request->nombre)) {
            $query->where('nombre', 'LIKE', '%' . $request->nombre . '%');
        }
        
        // Filtro por categoría
        if ($request->has('categoria_id') && !empty($request->categoria_id)) {
            $query->where('categoria_id', $request->categoria_id);
        }
        
        $places = $query->get();
        
        $places = $places->map(function($place) {
            return [
                'id' => $place->id,
                'nombre' => $place->nombre,
                'direccion' => $place->direccion,
                'coordenadas_lat' => $place->coordenadas_lat,
                'coordenadas_lon' => $place->coordenadas_lon,
                'categoria' => $place->category ? [
                    'nombre' => $place->category->name
                ] : null,
                'imagen' => $place->imagen
            ];
        });
        
        return response()->json($places);
    }

    public function show($id)
    {
        $place = Place::with(['category', 'tags'])->findOrFail($id);
        return response()->json($place);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'direccion' => 'required|string',
            'coordenadas_lat' => 'required|numeric',
            'coordenadas_lon' => 'required|numeric',
            'categoria_id' => 'required|exists:categories,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $place = new Place($request->except('imagen'));
            
            if ($request->hasFile('imagen')) {
                $path = $request->file('imagen')->store('public/places');
                $place->imagen = str_replace('public/', '', $path);
            }

            $place->save();

            DB::commit();

            return response()->json(['success' => 'Lugar creado correctamente'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear el lugar: ' . $e->getMessage()], 500);
        }
    }

    public function edit($id)
    {
        // Obtener el lugar con sus relaciones
        $place = Place::with(['category'])->findOrFail($id);

        // Formatear los datos para la respuesta JSON
        $data = [
            'id' => $place->id,
            'nombre' => $place->nombre,
            'descripcion' => $place->descripcion,
            'direccion' => $place->direccion,
            'coordenadas_lat' => $place->coordenadas_lat,
            'coordenadas_lon' => $place->coordenadas_lon,
            'categoria_id' => $place->category ? $place->category->id : null,
            'imagen' => $place->imagen,
        ];

        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'direccion' => 'required|string',
            'coordenadas_lat' => 'required|numeric',
            'coordenadas_lon' => 'required|numeric',
            'categoria_id' => 'required|exists:categories,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $place = Place::findOrFail($id);
            $place->fill($request->except('imagen'));
            
            if ($request->hasFile('imagen')) {
                // Eliminar imagen anterior si existe
                if ($place->imagen && Storage::exists('public/' . $place->imagen)) {
                    Storage::delete('public/' . $place->imagen);
                }
                
                $path = $request->file('imagen')->store('public/places');
                $place->imagen = str_replace('public/', '', $path);
            }

            $place->save();

            DB::commit();

            return response()->json([
                'success' => 'Lugar actualizado correctamente',
                'data' => $place // Opcional: devolver los datos actualizados
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al actualizar el lugar: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $place = Place::findOrFail($id);

            // Eliminar los favoritos asociados al lugar
            $place->favorites()->delete();

            // Eliminar los checkpoints asociados al lugar
            $place->checkpoints()->each(function ($checkpoint) {
                $checkpoint->gimcanas()->detach(); // Elimina las relaciones en gimcana_checkpoint
            });
            $place->checkpoints()->delete();
            if ($place->imagen && Storage::exists('public/' . $place->imagen)) {
                Storage::delete('public/' . $place->imagen);
            }
            $place->delete();
            DB::commit();
            return response()->json(['success' => 'Lugar eliminado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar el lugar: ' . $e->getMessage()], 500);
        }
    }
    public function search(Request $request)
    {
        $query = $request->input('query', '');
        if (empty($query)) {
            $places = Place::with('category')->limit(10)->get();
            return response()->json(['places' => $places]);
        }
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
        if ($places->isEmpty()) {
            $words = explode(' ', $query);
            $places = Place::with('category')
                ->where(function($q) use ($words) {
                    foreach ($words as $word) {
                        if (strlen($word) > 3) { 
                            $q->orWhere('nombre', 'LIKE', "%{$word}%")
                              ->orWhere('descripcion', 'LIKE', "%{$word}%")
                              ->orWhere('direccion', 'LIKE', "%{$word}%");
                        }
                    }
                })
                ->limit(20)
                ->get();
                
        }
            
        return response()->json(['places' => $places]);
    }
    public function toggleFavorite($id)
    {
        try {
            $place = Place::findOrFail($id);
            $place->favorito = !$place->favorito;
            $place->save();
            return response()->json([
                'success' => true,
                'message' => $place->favorito ? 'Lugar añadido a favoritos' : 'Lugar eliminado de favoritos',
                'favorito' => $place->favorito
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Error al cambiar el estado de favorito: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getTags()
    {
        try {
            $tags = \App\Models\Tag::all();
            return response()->json($tags);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las etiquetas: ' . $e->getMessage()
            ], 500);
        }
    }
}
