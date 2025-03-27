<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CustomCategorySeeder::class,
            TagSeeder::class,
            UserSeeder::class,
            PlaceSeeder::class,
            CheckpointSeeder::class,
            FavoriteSeeder::class,
            GimcanaSeeder::class,
            BellvitgeGimcanaSeeder::class, // Nueva gimcana de Bellvitge
            GroupSeeder::class,
            GroupUserSeeder::class,
            GroupCheckpointSeeder::class,
        ]);
    }
}
