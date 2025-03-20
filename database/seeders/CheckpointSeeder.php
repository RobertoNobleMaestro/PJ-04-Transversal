<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Checkpoint;

class CheckpointSeeder extends Seeder
{
    public function run(): void
    {
        $checkpoints = [
            [
                'place_id' => 1,
                'pista' => 'Busca la obra más famosa.',
                'validado' => false,
                'prueba' => 'Toma una foto de la obra.',
            ],
            [
                'place_id' => 2,
                'pista' => 'Encuentra el árbol más alto.',
                'validado' => false,
                'prueba' => 'Toma una foto del árbol.',
            ],
            [
                'place_id' => 3,
                'pista' => 'Busca la tienda de ropa más grande.',
                'validado' => false,
                'prueba' => 'Toma una foto de la tienda.',
            ],
            [
                'place_id' => 4,
                'pista' => 'Encuentra la estatua principal.',
                'validado' => false,
                'prueba' => 'Toma una foto de la estatua.',
            ],
        ];

        foreach ($checkpoints as $checkpoint) {
            Checkpoint::create($checkpoint);
        }
    }
}
