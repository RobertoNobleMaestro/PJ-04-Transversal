<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Checkpoint;
use App\Models\Place;
use App\Models\Gimcana;
use Illuminate\Support\Facades\DB;

class CheckpointController extends Controller
{
    public function index()
    {
        $checkpoints = Checkpoint::with('place', 'gimcanas')->get();
        return response()->json($checkpoints);
    }
    public function store(Request $request)
    {
        $request->validate([
            'place_id' => 'required|exists:places,id',
            'pista' => 'required|string',
            'prueba' => 'required|string',
            'respuesta' => 'required|string',
            'gimcana_id' => 'nullable|exists:gimcanas,id',
        ]);

        DB::beginTransaction();

        try {
            // Crear el checkpoint
            $checkpoint = new Checkpoint();
            $checkpoint->place_id = $request->place_id;
            $checkpoint->pista = $request->pista;
            $checkpoint->prueba = $request->prueba;
            $checkpoint->respuesta = $request->respuesta;
            $checkpoint->save();

            // Si se proporcionó un ID de gimcana, asignar el checkpoint a esa gimcana
            if ($request->has('gimcana_id') && $request->gimcana_id) {
                $gimcana = Gimcana::findOrFail($request->gimcana_id);
                $gimcana->checkpoints()->attach($checkpoint->id);
            }

            DB::commit();

            return response()->json([
                'success' => 'Checkpoint creado correctamente',
                'checkpoint' => $checkpoint
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al crear el checkpoint: ' . $e->getMessage()
            ], 500);
        }
    }
    public function show($id)
    {
        $checkpoint = Checkpoint::with('place', 'gimcanas')->findOrFail($id);
        return response()->json($checkpoint);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'place_id' => 'required|exists:places,id',
            'pista' => 'required|string',
            'prueba' => 'required|string',
            'respuesta' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
            $checkpoint = Checkpoint::findOrFail($id);
            $checkpoint->place_id = $request->place_id;
            $checkpoint->pista = $request->pista;
            $checkpoint->prueba = $request->prueba;
            $checkpoint->respuesta = $request->respuesta;
            $checkpoint->save();

            DB::commit();

            return response()->json([
                'success' => 'Checkpoint actualizado correctamente',
                'checkpoint' => $checkpoint
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al actualizar el checkpoint: ' . $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $checkpoint = Checkpoint::findOrFail($id);
            $checkpoint->gimcanas()->detach();
            $checkpoint->delete();
            DB::commit();

            return response()->json([
                'success' => 'Checkpoint eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al eliminar el checkpoint: ' . $e->getMessage()
            ], 500);
        }
    }
    public function recientes()
    {
        $checkpoints = Checkpoint::with('place')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        return response()->json($checkpoints);
    }

    public function getAllCheckpoints()
    {
        try {
            $checkpoints = Checkpoint::with('place')->get();
            return response()->json($checkpoints);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getCheckpoints($gimcanaId)
    {
        $checkpoints = Checkpoint::select('id', 'pista', 'prueba', 'respuesta', 'place_id')
            ->with('place')
            ->whereHas('gimcanas', function($query) use ($gimcanaId) {
                $query->where('gimcana_id', $gimcanaId);
            })
            ->get();

        return response()->json($checkpoints);
    }
}
