<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['nombre' => 'Exploradores'],
            ['nombre' => 'Aventureros'],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
