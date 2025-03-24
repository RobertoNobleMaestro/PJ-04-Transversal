<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GimcanaController extends Controller
{
    public function mostrardatosgrupo()
    {
        $usuarioactivo = Auth::user()->id;
        $usuario = GroupUser::where('user_id', Auth::user()->id)->get();
        $gruposusuarios = GroupUser::with('usuarios')->where('group_id', $usuario[0]->group_id)->get();
        $creador = Group::where('id', $usuario[0]->group_id)->with('creador')->get();
        return response()->json(['gruposusuarios' => $gruposusuarios, 'creador' => $creador, 'usuarioactivo' => $usuarioactivo]);
    }

    public function goGimcana()
    {
        $grupos = Group::with('creador')->get();
        $usuarios = User::all();
        $user = Auth::user();
        return view('gimcana', compact('grupos', 'usuarios', 'user'));
    }

    public function compronargrupousuario()
    {
        $user = Auth::user()->id;
        $usuarioengrupo = GroupUser::where('user_id', $user)->get();
        return response()->json(['usuarioengrupo' => $usuarioengrupo]);
    }

    public function infogimcana(Request $request)
    {
        $grupos = Group::with('creador');
        if ($request->codigo) {
            $codigo = $request->codigo;
            $grupos->where('codigogrupo', '=', "$codigo");
        }
        if ($request->creador) {
            $creador = $request->creador;
            $grupos->whereHas('creador', function ($query) use ($creador) {
                $query->where('name', 'like', "%$creador%");
            });
        }
        if (isset($request->codigo) || isset($request->creador)) {
            $grupos->where('miembros', '>=', "0");
        } else {
            $grupos->where('miembros', '>', "0");
        }
        $grupos = $grupos->get();

        $usuarios = User::all();
        $user = Auth::user();
        return response()->json(['grupos' => $grupos, 'usuarios' => $usuarios, 'user' => $user]);
    }

    public function unirseagrupo(Request $request)
    {
        try {
            $grupo = Group::where('id', $request->id)->get();

            if ($grupo[0]->miembros == 0) {
                echo "error El grupo " . $request->nombre . " está lleno";
                die();
            } else {
                $grupoUsuario = new GroupUser();
                $grupoUsuario->group_id = $request->id;
                $grupoUsuario->user_id = Auth::user()->id;
                $grupoUsuario->save();

                $grupo[0]->miembros = $grupo[0]->miembros - 1;
                $grupo[0]->save();
            }
            echo "success Te has unido al grupo " . $request->nombre;
        } catch (\Throwable $th) {
            echo "error No se ha podido unir al grupo " . $request->nombre;
        }
    }

    public function salirgrupo(Request $request)
    {
        try {
            $grupo = Group::where('id', $request->id)->get();
            $grupo[0]->miembros = $grupo[0]->miembros + 1;
            $grupo[0]->save();

            GroupUser::where('user_id', Auth::user()->id)->delete();

            echo "success Has abandonado el grupo " . $request->nombre;
        } catch (\PDOException $e) {
            echo "error No se ha abandonar el grupo " . $request->nombre;
            // echo $e;
        }
    }

    public function eliminargrupo(Request $request)
    {
        DB::beginTransaction();
        try {
            GroupUser::where('group_id', $request->id)->delete();
            Group::where('id', $request->id)->delete();
            DB::commit();
            echo "success Eliminarte el grupo " . $request->nombre;
        } catch (\PDOException $e) {
            DB::rollback();
            echo "error No eliminar el grupo " . $request->nombre;
        }
    }

    public function expulsargrupo(Request $request)
    {
        DB::beginTransaction();
        try {
            $grupo = GroupUser::find($request->id);

            $grupo = Group::where('id', $grupo->group_id)->get();
            $grupo[0]->miembros = $grupo[0]->miembros + 1;
            $grupo[0]->save();

            GroupUser::where('id', $request->id)->delete();

            echo "success Expulsaste a " . $request->nombre;
            DB::commit();
        } catch (\PDOException $e) {
            DB::rollback();
            echo "error No se pudo expulsar a " . $request->nombre;
        }
    }

    public function creargrupo(Request $request)
    {
        // Generar un código único de 6 caracteres
        do {
            $codigo = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6);
        } while (Group::where('codigogrupo', $codigo)->exists());

        // Iniciar una transacción para asegurar la integridad de los datos
        DB::beginTransaction();
        try {
            // Si existe un ID en la solicitud, significa que estamos modificando un grupo existente
            if (isset($request->id)) {
                // Buscar el grupo por ID
                $resultado = Group::find($request->id);
                // Actualizar los datos del grupo
                $resultado->nombre = $request->nombreGrupo;
                $resultado->codigogrupo = $codigo;
                $resultado->creador = Auth::user()->id;
                $resultado->miembros = $request->integrantes - 1;
                // Guardar los cambios en la base de datos
                $resultado->save();
                // Confirmar éxito
                echo "success Has modificado el grupo " . $request->nombreGrupo . " correctamente";
            } else {
                // Crear una nueva instancia de grupo
                $resultado = new Group();
                $resultado->nombre = $request->nombreGrupo;
                $resultado->codigogrupo = $codigo;
                $resultado->creador = Auth::user()->id;
                $resultado->miembros = $request->integrantes - 1;
                // Guardar el nuevo grupo
                $resultado->save();
                // Asignar el usuario creador al grupo en la tabla intermedia
                $grupoUsuario = new GroupUser();
                $grupoUsuario->group_id = $resultado->id;
                $grupoUsuario->user_id = Auth::user()->id;
                $grupoUsuario->save();
                // Confirmar éxito
                echo "success Has creado el grupo " . $request->nombreGrupo . " correctamente";
            }
            // Confirmar la transacción (guardar los cambios)
            DB::commit();
        } catch (\PDOException $e) {
            // Si hay un error, deshacer todos los cambios de la transacción
            DB::rollback();
            // Mostrar el mensaje de error
            echo "error No se pudo crear el grupo " . $request->nombreGrupo;
            die();
        }
    }
}
