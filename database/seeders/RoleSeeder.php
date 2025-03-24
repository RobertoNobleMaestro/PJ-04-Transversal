<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nombre' => 'admin'],
            ['nombre' => 'user'],
            ['nombre' => 'editor'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
