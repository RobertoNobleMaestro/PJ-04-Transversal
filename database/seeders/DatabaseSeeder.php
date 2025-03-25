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
            GroupSeeder::class,
            PlaceSeeder::class,
            CheckpointSeeder::class,
            FavoriteSeeder::class,
            GroupUserSeeder::class,
            GimcanaSeeder::class,
        ]);
    }
}
