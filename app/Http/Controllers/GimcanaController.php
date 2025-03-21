<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Checkpoint;

class GimcanaController extends Controller
{
    // Listar todas las gimcanas
    public function index()
    {
        $gimcanas = Checkpoint::all();
        return response()->json($gimcanas);
    }

    // Mostrar una gimcana específica
    public function show($id)
    {
        $gimcana = Checkpoint::findOrFail($id);
        return response()->json($gimcana);
    }

    // Crear una nueva gimcana
    public function store(Request $request)
    {
        $gimcana = Checkpoint::create($request->all());
        return response()->json($gimcana, 201);
    }

    // Actualizar una gimcana
    public function update(Request $request, $id)
    {
        $gimcana = Checkpoint::findOrFail($id);
        $gimcana->update($request->all());
        return response()->json($gimcana);
    }

    // Eliminar una gimcana
    public function destroy($id)
    {
        Checkpoint::destroy($id);
        return response()->json(null, 204);
    }
}
