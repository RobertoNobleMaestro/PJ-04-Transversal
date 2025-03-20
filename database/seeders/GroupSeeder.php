<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            ['name' => 'Exploradores'],
            ['name' => 'Aventureros'],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}
