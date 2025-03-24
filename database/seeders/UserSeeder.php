<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make('asdASD123'), 'role_id' => 1],
            ['name' => 'Maria Lopez', 'email' => 'maria@example.com', 'password' => Hash::make('asdASD123'), 'role_id' => 2],
            ['name' => 'Carlos Pérez', 'email' => 'carlos@example.com', 'password' => Hash::make('asdASD123'), 'role_id' => 2],
            ['name' => 'Laura Sanchez', 'email' => 'laura@example.com', 'password' => Hash::make('asdASD123'), 'role_id' => 2],
            ['name' => 'Javier Fernández', 'email' => 'javier@example.com', 'password' => Hash::make('asdASD123'), 'role_id' => 2],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
