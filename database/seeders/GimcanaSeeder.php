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
        // Verificar si el usuario ya existe antes de crearlo
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
                'role_id' => 1,
            ]
        );

        // Checkpoints actualizados según los lugares de Hospitalet
        $checkpoints = [
            [
                'place_id' => 1, // Museu de L'Hospitalet
                'pista' => 'Encuentra la pieza más antigua de la exposición.',
                'prueba' => 'Toma una foto y dinos qué es.',
            ],
            [
                'place_id' => 2, // Parc de Can Buxeres
                'pista' => 'Localiza la fuente central del parque.',
                'prueba' => 'Graba un video del sonido del agua.',
            ],
            [
                'place_id' => 3, // La Farga Centro Comercial
                'pista' => 'Encuentra la tienda con más colores en su escaparate.',
                'prueba' => 'Toma una foto del escaparate.',
            ],
            [
                'place_id' => 4, // Plaça de l'Ajuntament
                'pista' => 'Busca la placa conmemorativa más antigua.',
                'prueba' => 'Escribe el año que aparece en la placa.',
            ],
            [
                'place_id' => 5, // Mercat de Collblanc
                'pista' => 'Encuentra un puesto que venda frutas exóticas.',
                'prueba' => 'Dinos el nombre de una fruta que nunca hayas probado.',
            ],
            [
                'place_id' => 6, // Teatre Joventut
                'pista' => 'Mira la cartelera del teatro y encuentra una obra sobre historia.',
                'prueba' => 'Escribe el nombre de la obra y su fecha.',
            ],
            [
                'place_id' => 7, // Estadio Municipal de Fútbol
                'pista' => 'Busca el cartel con la historia del estadio.',
                'prueba' => 'Escribe el año en que fue inaugurado.',
            ],
            [
                'place_id' => 8, // Rambla Just Oliveras
                'pista' => 'Encuentra la escultura más moderna en la rambla.',
                'prueba' => 'Describe su forma en tres palabras.',
            ],
        ];

        // Guardar checkpoints en la base de datos
        $createdCheckpoints = [];
        foreach ($checkpoints as $checkpoint) {
            $createdCheckpoints[] = Checkpoint::create($checkpoint);
        }

        // Crear gimcanas de prueba
        $gimcana1 = Gimcana::create([
            'nombre' => 'Aventura Urbana en Hospitalet',
            'completed' => false,
        ]);

        $gimcana2 = Gimcana::create([
            'nombre' => 'Gimcana 2',
            'completed' => true,
        ]);

        // Crear grupos asociados a las gimcanas
        $group1 = Group::create([
            'codigogrupo' => 'GRP001',
            'nombre' => 'Grupo 1',
            'creador' => $user->id,
            'gimcana_id' => $gimcana1->id,
        ]);

        $group2 = Group::create([
            'codigogrupo' => 'GRP002',
            'nombre' => 'Grupo 2',
            'creador' => $user->id,
            'gimcana_id' => $gimcana2->id,
        ]);

        // Asociar checkpoints a cada gimcana
        $gimcana1->checkpoints()->attach([
            $createdCheckpoints[0]->id, 
            $createdCheckpoints[1]->id, 
            $createdCheckpoints[2]->id, 
            $createdCheckpoints[3]->id
        ]);

        $gimcana2->checkpoints()->attach([
            $createdCheckpoints[4]->id, 
            $createdCheckpoints[5]->id, 
            $createdCheckpoints[6]->id, 
            $createdCheckpoints[7]->id
        ]);
    }
}
