<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['nombre' => 'Exploradores', 'codigogrupo' => 'qweqwe', 'creador' => 1, 'miembros' => 1],
            ['nombre' => 'Aventureros', 'codigogrupo' => 'asdasd', 'creador' => 2, 'miembros' => 1],
            ['nombre' => 'Pioneros', 'codigogrupo' => 'ewqewq', 'creador' => 3, 'miembros' => 1],
            ['nombre' => 'Rovers', 'codigogrupo' => 'lqpwes', 'creador' => 4, 'miembros' => 1],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
