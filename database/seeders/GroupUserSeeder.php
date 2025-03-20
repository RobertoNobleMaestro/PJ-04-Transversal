<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GroupUser;

class GroupUserSeeder extends Seeder
{
    public function run(): void
    {
        $groupUsers = [
            ['group_id' => 1, 'user_id' => 2],
            ['group_id' => 1, 'user_id' => 3],
        ];

        foreach ($groupUsers as $groupUser) {
            GroupUser::create($groupUser);
        }
    }
}
