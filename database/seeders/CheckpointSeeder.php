<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Checkpoint;

class CheckpointSeeder extends Seeder
{
    public function run(): void
    {
        $checkpoints = [
            ['place_id' => 1, 'clue' => 'Busca la obra más famosa.'],
            ['place_id' => 2, 'clue' => 'Sube a la parte más alta y mira la vista.'],
        ];

        foreach ($checkpoints as $checkpoint) {
            Checkpoint::create($checkpoint);
        }
    }
}
