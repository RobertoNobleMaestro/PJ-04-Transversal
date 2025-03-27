<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gimcana;
use App\Models\Group;
use App\Models\Checkpoint;
use App\Models\User;

class GimcanaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Checkpoints actualizados según los lugares de Hospitalet
        $checkpoints = [
            [
                'place_id' => 1, // Museu de L'Hospitalet
                'pista' => 'Encuentra la pieza más antigua de la exposición.',
                'prueba' => 'Toma una foto y dinos qué es.',
                'respuesta' => 'Estatua romana del siglo II',
            ],
            [
                'place_id' => 2, // Parc de Can Buxeres
                'pista' => 'Localiza la fuente central del parque.',
                'prueba' => 'Graba un video del sonido del agua.',
                'respuesta' => 'Fuente con 8 chorros',
            ],
            [
                'place_id' => 3, // La Farga Centro Comercial
                'pista' => 'Encuentra la tienda con más colores en su escaparate.',
                'prueba' => 'Toma una foto del escaparate.',
                'respuesta' => 'Tienda de disfraces',
            ],
            [
                'place_id' => 4, // Plaça de l'Ajuntament
                'pista' => 'Busca la placa conmemorativa más antigua.',
                'prueba' => 'Escribe el año que aparece en la placa.',
                'respuesta' => '1905',
            ],
            [
                'place_id' => 5, // Mercat de Collblanc
                'pista' => 'Encuentra un puesto que venda frutas exóticas.',
                'prueba' => 'Dinos el nombre de una fruta que nunca hayas probado.',
                'respuesta' => 'Rambután',
            ],
            [
                'place_id' => 6, // Teatre Joventut
                'pista' => 'Mira la cartelera del teatro y encuentra una obra sobre historia.',
                'prueba' => 'Escribe el nombre de la obra y su fecha.',
                'respuesta' => 'Historia de Hospitalet - 20/05/2025',
            ],
            [
                'place_id' => 7, // Estadio Municipal de Fútbol
                'pista' => 'Busca el cartel con la historia del estadio.',
                'prueba' => 'Escribe el año en que fue inaugurado.',
                'respuesta' => '1957',
            ],
            [
                'place_id' => 8, // Rambla Just Oliveras
                'pista' => 'Encuentra la escultura más moderna en la rambla.',
                'prueba' => 'Describe su forma en tres palabras.',
                'respuesta' => 'Abstracta, metálica, luminosa',
            ],
        ];

        // Guardar checkpoints en la base de datos
        $createdCheckpoints = [];
        foreach ($checkpoints as $checkpoint) {
            $createdCheckpoints[] = Checkpoint::create($checkpoint);
        }
    }
}
