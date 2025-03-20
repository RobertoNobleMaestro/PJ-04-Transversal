<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['nombre' => 'Familiar'],
            ['nombre' => 'Romántico'],
            ['nombre' => 'Aventura'],
            ['nombre' => 'Historia'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
