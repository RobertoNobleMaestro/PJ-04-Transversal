<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gimcana;
use App\Models\Checkpoint;
use App\Models\Place;

class GimcanaController extends Controller
{
    // Listar todas las gimcanas
    public function index()
    {
        return view('admin.gimcanas.index');
    }

    public function getGimcanas()
    {
        $gimcanas = Gimcana::with(['group', 'checkpoints.place', 'creator'])->get();
        return response()->json($gimcanas);
    }

    // Mostrar una gimcana específica
    public function show($id)
    {
        $gimcana = Gimcana::with(['checkpoints.place'])->find($id);
        $checkpoint = $gimcana->checkpoint;
        return response()->json($gimcana);
    }

    // Crear una nueva gimcana
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'group_id' => 'required|exists:groups,id',
            'checkpoints' => 'required|array|min:4|max:4', // Asegura que se envíen exactamente 4 checkpoints
            'completed' => 'boolean',
        ]);

        $gimcana = Gimcana::create([
            'nombre' => $request->nombre,
            'group_id' => $request->group_id,
            'completed' => $request->completed,
        ]);

        $gimcana->checkpoints()->attach($request->checkpoints);

        return response()->json($gimcana, 201);
    }

    // Actualizar una gimcana
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'group_id' => 'required|exists:groups,id',
            'checkpoints' => 'required|array|min:4|max:4', // Asegura que se envíen exactamente 4 checkpoints
            'completed' => 'boolean',
        ]);

        $gimcana = Gimcana::findOrFail($id);
        $gimcana->update([
            'nombre' => $request->nombre,
            'group_id' => $request->group_id,
            'completed' => $request->completed,
        ]);

        $gimcana->checkpoints()->sync($request->checkpoints);

        return response()->json($gimcana);
    }

    // Eliminar una gimcana
    public function destroy($id)
    {
        $gimcana = Gimcana::find($id);
        $gimcana->checkpoints()->delete();
        $gimcana->delete();

        return response()->json(null, 204);
    }

    public function getCheckpoints($id)
    {
        // Cargar la gimcana con los checkpoints y sus lugares asociados
        $gimcana = Gimcana::with(['checkpoints.place'])->findOrFail($id);

        // Mapear los checkpoints para devolver los datos necesarios
        $checkpoints = $gimcana->checkpoints->map(function($checkpoint) {
            return [
                'pista' => $checkpoint->pista,
                'prueba' => $checkpoint->prueba,
                'place' => $checkpoint->place ? [
                    'nombre' => $checkpoint->place->nombre,
                    'direccion' => $checkpoint->place->direccion,
                    'coordenadas_lat' => $checkpoint->place->coordenadas_lat,
                    'coordenadas_lon' => $checkpoint->place->coordenadas_lon,
                ] : null,
            ];
        });

        return response()->json($checkpoints);
    }
}
