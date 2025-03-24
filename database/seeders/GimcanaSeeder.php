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
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role_id' => 1,
            ]
        );

        // Crear gimcanas
        $gimcana1 = Gimcana::create([
            'nombre' => 'Gimcana 1',
            'completed' => false,
        ]);

        $gimcana2 = Gimcana::create([
            'nombre' => 'Gimcana 2',
            'completed' => true,
        ]);

        // Crear grupos asociados a las gimcanas
        $group1 = Group::create([
            'codigogrupo' => 'GRP001',
            'nombre' => 'Grupo 1',
            'creador' => $user->id,
            'gimcana_id' => $gimcana1->id,
        ]);

        $group2 = Group::create([
            'codigogrupo' => 'GRP002',
            'nombre' => 'Grupo 2',
            'creador' => $user->id,
            'gimcana_id' => $gimcana2->id,
        ]);

        // Crear checkpoints
        $checkpoints = [
            ['place_id' => 1, 'pista' => 'Pista 1', 'prueba' => 'Prueba 1'],
            ['place_id' => 2, 'pista' => 'Pista 2', 'prueba' => 'Prueba 2'],
            ['place_id' => 3, 'pista' => 'Pista 3', 'prueba' => 'Prueba 3'],
            ['place_id' => 4, 'pista' => 'Pista 4', 'prueba' => 'Prueba 4'],
        ];

        foreach ($checkpoints as $checkpoint) {
            Checkpoint::create($checkpoint);
        }

        // Asociar checkpoints a las gimcanas
        $gimcana1->checkpoints()->attach(Checkpoint::pluck('id'));
        $gimcana2->checkpoints()->attach(Checkpoint::pluck('id'));
    }
}
