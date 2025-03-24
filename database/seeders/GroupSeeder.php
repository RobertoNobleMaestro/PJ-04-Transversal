<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Gimcana;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        // Primero, asegúrate de que exista al menos una gimcana
        $gimcanaId = Gimcana::firstOrCreate([
            'nombre' => 'Gimcana Principal',
            'completed' => false
        ])->id;

        $groups = [
            ['nombre' => 'Exploradores', 'codigogrupo' => 'qweqwe', 'creador' => 1, 'gimcana_id' => $gimcanaId, 'miembros' => 1],
            ['nombre' => 'Aventureros', 'codigogrupo' => 'asdasd', 'creador' => 2, 'gimcana_id' => $gimcanaId, 'miembros' => 1],
            ['nombre' => 'Pioneros', 'codigogrupo' => 'ewqewq', 'creador' => 3, 'gimcana_id' => $gimcanaId, 'miembros' => 1],
            ['nombre' => 'Rovers', 'codigogrupo' => 'lqpwes', 'creador' => 4, 'gimcana_id' => $gimcanaId, 'miembros' => 1],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
