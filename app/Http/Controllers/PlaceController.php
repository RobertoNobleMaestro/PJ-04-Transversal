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

    public function getPlaces()
    {
        $places = Place::with('category')->get();
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
                'etiquetas' => $place->tags->pluck('nombre')->toArray(),
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
        $place = Place::findOrFail($id);
        $place->delete();
        return response()->json(null, 204);
    }
}
