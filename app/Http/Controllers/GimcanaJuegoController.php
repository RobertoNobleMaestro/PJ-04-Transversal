<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\Checkpoint;
use App\Models\Gimcana;
use App\Models\GroupCheckpoint;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GimcanaJuegoController extends Controller
{
    public function index()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();
        
        // Obtener el grupo del usuario activo
        $groupUser = GroupUser::where('user_id', $user->id)->first();
        
        if (!$groupUser) {
            return response()->json([
                'error' => 'No perteneces a ningún grupo',
                'status' => 'error'
            ]);
        }
        
        $group = Group::find($groupUser->group_id);
        
        if (!$group) {
            return response()->json([
                'error' => 'Grupo no encontrado',
                'status' => 'error'
            ]);
        }
        
        // Obtener todos los usuarios del grupo
        $groupUsers = GroupUser::with('usuarios')
                              ->where('group_id', $group->id)
                              ->get();
        
        // Obtener la gimcana asociada al grupo
        $gimcana = Gimcana::find($group->gimcana_id);
        
        if (!$gimcana) {
            return response()->json([
                'error' => 'Gimcana no encontrada',
                'status' => 'error'
            ]);
        }
        
        // Obtener los checkpoints de la gimcana
        $checkpoints = Checkpoint::whereHas('gimcanas', function($query) use ($gimcana) {
            $query->where('gimcanas.id', $gimcana->id);
        })->get();
        
        // Verificar cuáles checkpoints ya han sido completados por el grupo
        $completedCheckpoints = GroupCheckpoint::where('groupuser_id', $groupUser->id)
                                            ->pluck('checkpoint_id')
                                            ->toArray();
        
        // Agregar información sobre completado a cada checkpoint
        $checkpointsWithStatus = $checkpoints->map(function($checkpoint) use ($completedCheckpoints) {
            $checkpoint->completed = in_array($checkpoint->id, $completedCheckpoints);
            return $checkpoint;
        });
        
        return response()->json([
            'status' => 'success',
            'grupo' => $group,
            'gimcana' => $gimcana,
            'usuarios_grupo' => $groupUsers,
            'checkpoints' => $checkpointsWithStatus,
            'usuario_activo' => $user->id,
            'checkpoints_completados' => $completedCheckpoints
        ]);
    }

    public function gimcanagame()
    {
        return view('juego.index');
    }

    public function getCheckpointsForMap()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();
        
        // Verificar si el usuario está autenticado
        if (!$user) {
            return response()->json([
                'error' => 'Usuario no autenticado',
                'status' => 'error'
            ]);
        }
        
        // Obtener el grupo del usuario activo
        $groupUser = GroupUser::where('user_id', $user->id)->first();
        
        if (!$groupUser) {
            return response()->json([
                'error' => 'No perteneces a ningún grupo',
                'status' => 'error'
            ]);
        }
        
        $group = Group::find($groupUser->group_id);
        
        if (!$group) {
            return response()->json([
                'error' => 'Grupo no encontrado',
                'status' => 'error'
            ]);
        }
        
        if (!$group->gimcana_id) {
            return response()->json([
                'error' => 'El grupo no tiene una gimcana asignada',
                'status' => 'error'
            ]);
        }
        
        // Obtener la gimcana asociada al grupo
        $gimcana = Gimcana::find($group->gimcana_id);
        
        if (!$gimcana) {
            return response()->json([
                'error' => 'Gimcana no encontrada',
                'status' => 'error'
            ]);
        }
        
        // Obtener los checkpoints con sus lugares (que tienen coordenadas)
        $checkpoints = Checkpoint::with('place')
            ->whereHas('gimcanas', function($query) use ($gimcana) {
                $query->where('gimcanas.id', $gimcana->id);
            })->get();
        
        // Si no hay checkpoints, devolver un mensaje útil
        if ($checkpoints->isEmpty()) {
            return response()->json([
                'status' => 'warning',
                'message' => 'Esta gimcana no tiene checkpoints configurados',
                'checkpoints' => []
            ]);
        }
        
        // Verificar cuáles checkpoints ya han sido completados por el grupo
        $completedCheckpoints = GroupCheckpoint::where('groupuser_id', $groupUser->id)
                                            ->pluck('checkpoint_id')
                                            ->toArray();
        
        // Formatear datos para el mapa
        $mapData = $checkpoints->map(function($checkpoint) use ($completedCheckpoints) {
            if (!$checkpoint->place) {
                \Log::error('Checkpoint sin lugar asociado: ' . $checkpoint->id);
                return null;
            }
            return [
                'id' => $checkpoint->id,
                'name' => $checkpoint->place->nombre,
                'lat' => (float) $checkpoint->place->coordenadas_lat,
                'lng' => (float) $checkpoint->place->coordenadas_lon,
                'pista' => $checkpoint->pista ?? 'Sin pista disponible',
                'prueba' => $checkpoint->prueba ?? 'Sin prueba disponible',
                'completed' => in_array($checkpoint->id, $completedCheckpoints)
            ];
        })->filter()->values();
        
        return response()->json([
            'status' => 'success',
            'checkpoints' => $mapData
        ]);
    }

    public function validarCheckpoint(Request $request, $id)
    {
        // Obtener el usuario autenticado
        $user = Auth::user();
        
        // Obtener el grupo del usuario
        $groupUser = GroupUser::where('user_id', $user->id)->first();
        
        if (!$groupUser) {
            return response()->json([
                'error' => 'No perteneces a ningún grupo',
                'status' => 'error'
            ]);
        }
        
        // Obtener información del grupo
        $grupo = Group::find($groupUser->group_id);
        
        // Verificar si el checkpoint existe
        $checkpoint = Checkpoint::find($id);
        
        if (!$checkpoint) {
            return response()->json([
                'error' => 'Checkpoint no encontrado',
                'status' => 'error'
            ]);
        }
        
        // Verificar si ya está validado por este usuario
        $existingValidation = GroupCheckpoint::where('groupuser_id', $groupUser->id)
                                         ->where('checkpoint_id', $id)
                                         ->first();
        
        if ($existingValidation) {
            return response()->json([
                'error' => 'Ya has validado este checkpoint',
                'status' => 'error'
            ]);
        }
        
        // Verificar respuesta si es aplicable
        if ($request->has('respuesta')) {
            $userResponse = $request->respuesta;
            $correctResponse = $checkpoint->respuesta;
            
            $isCorrect = strtolower(trim($userResponse)) === strtolower(trim($correctResponse));
            
            if (!$isCorrect) {
                return response()->json([
                    'error' => 'La respuesta no es correcta',
                    'status' => 'error'
                ]);
            }
        }
        
        // Crear nuevo registro de checkpoint completado
        GroupCheckpoint::create([
            'groupuser_id' => $groupUser->id,
            'checkpoint_id' => $id,
            'validado' => true
        ]);
        
        // Comprobar si todos los miembros del grupo han completado este checkpoint
        $groupMembers = GroupUser::where('group_id', $grupo->id)->get();
        $allMembersCompleted = true;
        
        foreach ($groupMembers as $member) {
            $completed = GroupCheckpoint::where('groupuser_id', $member->id)
                                     ->where('checkpoint_id', $id)
                                     ->exists();
            if (!$completed) {
                $allMembersCompleted = false;
                break;
            }
        }
        
        return response()->json([
            'status' => 'success',
            'message' => '¡Checkpoint completado correctamente!',
            'groupCompleted' => $allMembersCompleted,
            'totalMembers' => $groupMembers->count(),
            'completedMembers' => GroupCheckpoint::where('checkpoint_id', $id)
                                              ->whereIn('groupuser_id', $groupMembers->pluck('id'))
                                              ->count()
        ]);
    }
    
    /**
     * Elimina la relación del usuario con el grupo y la gimcana
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function abandonar()
    {
        // Obtener el usuario autenticado
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario no autenticado'
            ]);
        }
        
        // Obtener el grupo del usuario
        $groupUser = GroupUser::where('user_id', $user->id)->first();
        
        if (!$groupUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'No perteneces a ningún grupo'
            ]);
        }
        
        $groupId = $groupUser->group_id;
        
        try {
            // Eliminar todos los checkpoints completados por el usuario
            GroupCheckpoint::where('groupuser_id', $groupUser->id)->delete();
            
            // Eliminar la relación del usuario con el grupo
            $groupUser->delete();
            
            // Verificar si el grupo se queda sin miembros
            $remainingMembers = GroupUser::where('group_id', $groupId)->count();
            
            if ($remainingMembers === 0) {
                // Si no quedan miembros, eliminar el grupo
                Group::where('id', $groupId)->delete();
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Has abandonado la gimcana correctamente'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al abandonar gimcana: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Ha ocurrido un error al abandonar la gimcana: ' . $e->getMessage()
            ]);
        }
    }
}
