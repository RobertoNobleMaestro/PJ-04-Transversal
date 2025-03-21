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

        // Crear gimcanas de prueba
        Gimcana::create([
            'group_id' => $group1->id,
            'checkpoint_id' => $checkpoint1->id,
            'completed' => false,
        ]);

        Gimcana::create([
            'group_id' => $group2->id,
            'checkpoint_id' => $checkpoint2->id,
            'completed' => true,
        ]);

        // Mensaje de confirmación
        $this->command->info('¡Gimcanas creadas con éxito!');
    }
}
