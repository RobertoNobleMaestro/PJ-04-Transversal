<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Favorite;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        $favorites = [
            ['user_id' => 2, 'place_id' => 1],
            ['user_id' => 3, 'place_id' => 2],
        ];

        foreach ($favorites as $favorite) {
            Favorite::create($favorite);
        }
    }
}
