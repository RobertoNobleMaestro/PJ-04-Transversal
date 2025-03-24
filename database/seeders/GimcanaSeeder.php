<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Gimcana;
use App\Models\Group;
use App\Models\Checkpoint;
use App\Models\User;

class GimcanaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si el usuario ya existe antes de crearlo
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'], // Buscar por correo electrónico
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role_id' => 1, // Asegúrate de que exista un rol con ID 1
            ]
        );

        // Crear algunos grupos y checkpoints de prueba
        $group1 = Group::create([
            'codigogrupo' => 'GRP001', // Proporciona un valor para 'codigogrupo'
            'nombre' => 'Grupo 1',
            'creador' => $user->id, // Proporciona el ID del usuario como valor para 'creador'
        ]);

        $group2 = Group::create([
            'codigogrupo' => 'GRP002', // Proporciona un valor para 'codigogrupo'
            'nombre' => 'Grupo 2',
            'creador' => $user->id, // Proporciona el ID del usuario como valor para 'creador'
        ]);

        $checkpoint1 = Checkpoint::create([
            'place_id' => 1, // Asegúrate de que exista un lugar con ID 1
            'pista' => 'Pista 1',
            'prueba' => 'Prueba 1',
        ]);

        $checkpoint2 = Checkpoint::create([
            'place_id' => 2, // Asegúrate de que exista un lugar con ID 2
            'pista' => 'Pista 2',
            'prueba' => 'Prueba 2',
        ]);

        $checkpoint3 = Checkpoint::create([
            'place_id' => 3, // Asegúrate de que exista un lugar con ID 3
            'pista' => 'Pista 3',
            'prueba' => 'Prueba 3',
        ]);

        $checkpoint4 = Checkpoint::create([
            'place_id' => 4, // Asegúrate de que exista un lugar con ID 4
            'pista' => 'Pista 4',
            'prueba' => 'Prueba 4',
        ]);

        // Crear gimcanas de prueba
        $gimcana1 = Gimcana::create([
            'nombre' => 'Gimcana 1',
            'group_id' => $group1->id,
            'completed' => false,
        ]);

        $gimcana2 = Gimcana::create([
            'nombre' => 'Gimcana 2',
            'group_id' => $group2->id,
            'completed' => true,
        ]);

        // Asociar 4 checkpoints a cada gimcana
        $gimcana1->checkpoints()->attach([$checkpoint1->id, $checkpoint2->id, $checkpoint3->id, $checkpoint4->id]);
        $gimcana2->checkpoints()->attach([$checkpoint1->id, $checkpoint2->id, $checkpoint3->id, $checkpoint4->id]);
    }
}
