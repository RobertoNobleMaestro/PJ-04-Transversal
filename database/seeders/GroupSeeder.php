<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Gimcana;

class GroupSeeder extends Seeder
{
    public function run(): void
    {

        $groups = [
            ['nombre' => 'Pioneros', 'codigogrupo' => '7mKvTx', 'estado' => 'Completo', 'creador' => 2, 'gimcana_id' => 1, 'miembros' => 0],
            ['nombre' => 'Rovers', 'codigogrupo' => 'txKOvd', 'estado' => 'Completo', 'creador' => 3, 'gimcana_id' => 1, 'miembros' => 0],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
