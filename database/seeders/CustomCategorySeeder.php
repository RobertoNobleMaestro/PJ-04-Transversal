<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['id' => 1, 'name' => 'Museo', 'icon' => 'fa-museum', 'color' => '#FF5733', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Centro Comercial', 'icon' => 'fa-shopping-mall', 'color' => '#33FF57', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Parque', 'icon' => 'fa-tree', 'color' => '#3357FF', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Monumento', 'icon' => 'fa-monument', 'color' => '#F3FF33', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Playa', 'icon' => 'fa-umbrella-beach', 'color' => '#33FFF3', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'Restaurante', 'icon' => 'fa-utensils', 'color' => '#FF33F3', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 7, 'name' => 'Tienda', 'icon' => 'fa-store', 'color' => '#FF8033', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 8, 'name' => 'Hotel', 'icon' => 'fa-hotel', 'color' => '#33FF80', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 9, 'name' => 'Cafetería', 'icon' => 'fa-coffee', 'color' => '#8033FF', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 10, 'name' => 'Bar', 'icon' => 'fa-glass-martini-alt', 'color' => '#FF3380', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 11, 'name' => 'Mercado', 'icon' => 'fa-shopping-basket', 'color' => '#80FF33', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 12, 'name' => 'Teatro', 'icon' => 'fa-theater-masks', 'color' => '#3380FF', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 13, 'name' => 'Estadio', 'icon' => 'fa-futbol', 'color' => '#F333FF', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('categories')->insert($categories);
    }
}
