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
        $gimcanas = Gimcana::with(['checkpoint.place'])->get();
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
            'checkpoints' => 'required|array',
        ]);

        $gimcana = Gimcana::create(['nombre' => $request->nombre]);

        foreach ($request->checkpoints as $checkpointData) {
            $gimcana->checkpoints()->create([
                'place_id' => $checkpointData['place_id'],
                'pista' => $checkpointData['pista'],
                'prueba' => $checkpointData['prueba'],
            ]);
        }

        return response()->json($gimcana, 201);
    }

    // Actualizar una gimcana
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'checkpoints' => 'required|array',
        ]);

        $gimcana = Gimcana::find($id);
        $gimcana->update(['nombre' => $request->nombre]);

        $gimcana->checkpoints()->delete();
        foreach ($request->checkpoints as $checkpointData) {
            $gimcana->checkpoints()->create([
                'place_id' => $checkpointData['place_id'],
                'pista' => $checkpointData['pista'],
                'prueba' => $checkpointData['prueba'],
            ]);
        }

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
}
