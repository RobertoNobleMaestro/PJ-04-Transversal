<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GroupCheckpoint;

class GroupCheckpointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groupsusers = [
            ['groupuser_id' => 1, 'checkpoint_id' => 1],
            ['groupuser_id' => 2, 'checkpoint_id' => 1],
            ['groupuser_id' => 3, 'checkpoint_id' => 1],
            ['groupuser_id' => 4, 'checkpoint_id' => 1],
        ];

        foreach ($groupsusers as $groupsuser) {
            GroupCheckpoint::create($groupsuser);
        }
    }
}
