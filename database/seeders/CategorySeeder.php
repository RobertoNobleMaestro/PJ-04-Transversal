<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Museos', 'icon' => 'museo-icon.png', 'color' => '#FF5733'],
            ['name' => 'Restaurantes', 'icon' => 'restaurante-icon.png', 'color' => '#33FF57'],
            ['name' => 'Parques', 'icon' => 'parque-icon.png', 'color' => '#3357FF'],
            ['name' => 'Monumentos', 'icon' => 'monumento-icon.png', 'color' => '#FF33A1'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
