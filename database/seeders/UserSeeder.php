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
            ['name' => 'Admin', 'email' => 'admin@example.com', 'password' => Hash::make('password'), 'role' => 'admin'],
            ['name' => 'Maria Lopez', 'email' => 'maria@example.com', 'password' => Hash::make('password'), 'role' => 'user'],
            ['name' => 'Carlos Pérez', 'email' => 'carlos@example.com', 'password' => Hash::make('password'), 'role' => 'user'],
            ['name' => 'Laura Sanchez', 'email' => 'laura@example.com', 'password' => Hash::make('password'), 'role' => 'user'],
            ['name' => 'Javier Fernández', 'email' => 'javier@example.com', 'password' => Hash::make('password'), 'role' => 'user'],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
