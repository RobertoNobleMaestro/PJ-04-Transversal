<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            ['name' => 'Familiar'],
            ['name' => 'Romántico'],
            ['name' => 'Aventura'],
            ['name' => 'Historia'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
