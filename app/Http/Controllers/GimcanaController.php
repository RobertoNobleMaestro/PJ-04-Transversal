<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gimcana;
use App\Models\Checkpoint;
use App\Models\Place;
use Illuminate\Support\Facades\DB;

class GimcanaController extends Controller
{
    // Listar todas las gimcanas
    public function index()
    {
        return view('admin.gimcanas.index');
    }

    public function getGimcanas(Request $request)
    {
        $query = Gimcana::with(['groups.creator', 'checkpoints.place']);

        // Filtro por nombre
        if ($request->has('nombre') && !empty($request->nombre)) {
            $query->where('nombre', 'LIKE', '%' . $request->nombre . '%');
        }

        // Filtro por creador
        if ($request->has('creador') && !empty($request->creador)) {
            $query->whereHas('creator', function($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->creador . '%');
            });
        }

        $gimcanas = $query->get();

        // Mapear los datos para devolver solo lo necesario
        $gimcanas = $gimcanas->map(function($gimcana) {
            return [
                'id' => $gimcana->id,
                'nombre' => $gimcana->nombre,
                'group' => $gimcana->groups->first() ? [
                    'codigogrupo' => $gimcana->groups->first()->codigogrupo ?? 'Sin código',
                ] : null,
                'creator' => $gimcana->creator ? [
                    'name' => $gimcana->creator->name ?? 'Sin nombre'
                ] : null,
                'completed' => $gimcana->completed,
                'checkpoints' => $gimcana->checkpoints->map(function($checkpoint) {
                    return [
                        'pista' => $checkpoint->pista,
                        'prueba' => $checkpoint->prueba,
                        'place' => $checkpoint->place ? [
                            'nombre' => $checkpoint->place->nombre
                        ] : null
                    ];
                })
            ];
        });

        return response()->json($gimcanas);
    }

    public function show($id)
    {
        $gimcana = Gimcana::with(['checkpoints.place'])->find($id);
    
        if (!$gimcana) {
            return response()->json(['error' => 'Gimcana no encontrada'], 404);
        }
    
        return response()->json($gimcana);
    }
    
    // Crear una nueva gimcana
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'checkpoints' => 'required|array|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Crear la gimcana
            $gimcana = new Gimcana();
            $gimcana->nombre = $request->nombre;
            $gimcana->save();

            // Asignar checkpoints
            $gimcana->checkpoints()->sync($request->checkpoints);

            DB::commit();

            return response()->json(['success' => 'Gimcana creada correctamente'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear la gimcana: ' . $e->getMessage()], 500);
        }
    }

    // Actualizar una gimcana
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'checkpoints' => 'required|array|min:1',
        ]);

        $gimcana = Gimcana::findOrFail($id);
        $gimcana->update([
            'nombre' => $request->nombre,
        ]);

        // Sincronizar checkpoints
        $gimcana->checkpoints()->sync($request->checkpoints);

        return response()->json(['success' => true, 'gimcana' => $gimcana]);
    }

    // Eliminar una gimcana
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $gimcana = Gimcana::findOrFail($id);

            // Eliminar los checkpoints asociados a la gimcana
            $gimcana->checkpoints()->detach();

            // Eliminar la gimcana
            $gimcana->delete();

            DB::commit();

            return response()->json(['success' => 'Gimcana eliminada correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar la gimcana: ' . $e->getMessage()], 500);
        }
    }

    public function getCheckpoints($id)
    {
        $gimcana = Gimcana::with(['checkpoints' => function($query) {
            $query->orderBy('gimcana_checkpoint.created_at', 'asc');
        }])->findOrFail($id);

        // Mapear los checkpoints para devolver los datos necesarios
        $checkpoints = $gimcana->checkpoints->map(function($checkpoint) {
            return [
                'id' => $checkpoint->id,
                'pista' => $checkpoint->pista,
                'prueba' => $checkpoint->prueba,
                'respuesta' => $checkpoint->respuesta,
                'place' => $checkpoint->place ? [
                    'id' => $checkpoint->place->id,
                    'nombre' => $checkpoint->place->nombre,
                ] : null,
            ];
        });

        return response()->json($checkpoints);
    }

    public function edit($id)
    {
        // Obtener la gimcana con sus relaciones
        $gimcana = Gimcana::with(['group', 'checkpoints'])->findOrFail($id);

        // Formatear los datos para la respuesta JSON
        $data = [
            'id' => $gimcana->id,
            'nombre' => $gimcana->nombre,
            'group_id' => $gimcana->group ? $gimcana->group->id : null,
            'group' => $gimcana->group ? [
                'id' => $gimcana->group->id,
                'nombre' => $gimcana->group->nombre,
            ] : null,
            'checkpoints' => $gimcana->checkpoints->map(function ($checkpoint) {
                return [
                    'id' => $checkpoint->id,
                    'pista' => $checkpoint->pista,
                    'prueba' => $checkpoint->prueba,
                    'place' => $checkpoint->place ? [
                        'id' => $checkpoint->place->id,
                        'nombre' => $checkpoint->place->nombre,
                    ] : null,
                ];
            }),
        ];

        return response()->json($data);
    }

    public function getPlaces()
    {
        $places = Place::with('category')->get();
        return response()->json($places);
    }
}
