<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Checkpoint;

class CheckpointSeeder extends Seeder
{
    public function run(): void
    {
        $checkpoints = [
            [
                'place_id' => 1,
                'pista' => 'Busca la plaza más emblemática de Hospitalet.',
                'validado' => false,
                'prueba' => '¿Cuántas farolas hay alrededor de la Plaza del Ayuntamiento?',
                'respuesta' => '12 farolas',
            ],
            [
                'place_id' => 2,
                'pista' => 'Encuentra el edificio del Ayuntamiento de Hospitalet.',
                'validado' => false,
                'prueba' => '¿En qué año se construyó el edificio actual del Ayuntamiento?',
                'respuesta' => '1895',
            ],
            [
                'place_id' => 3,
                'pista' => 'Visita el Parque de la Torrassa en Hospitalet.',
                'validado' => false,
                'prueba' => '¿Cuántos metros de altura tiene la torre que da nombre al parque?',
                'respuesta' => '40 metros',
            ],
            [
                'place_id' => 4,
                'pista' => 'Busca el Centro Cultural La Bóbila en Hospitalet.',
                'validado' => false,
                'prueba' => '¿Qué actividad cultural se realiza los sábados por la tarde en este centro?',
                'respuesta' => 'Teatro amateur',
            ],
            [
                'place_id' => 5,
                'pista' => 'Visita el Museo de Historia de Hospitalet.',
                'validado' => false,
                'prueba' => '¿En qué antigua masía se encuentra ubicado el museo?',
                'respuesta' => 'Can Riera',
            ],
            [
                'place_id' => 6,
                'pista' => 'Encuentra el Distrito Cultural de Hospitalet.',
                'validado' => false,
                'prueba' => '¿Cuántas galerías de arte hay actualmente en el Distrito Cultural?',
                'respuesta' => '15 galerías',
            ],
            [
                'place_id' => 7,
                'pista' => 'Visita el Centro Comercial La Farga en Hospitalet.',
                'validado' => false,
                'prueba' => '¿Qué antigua fábrica ocupaba este espacio antes de ser centro comercial?',
                'respuesta' => 'La Farga',
            ],
            [
                'place_id' => 8,
                'pista' => 'Busca el estadio municipal de fútbol de Hospitalet.',
                'validado' => false,
                'prueba' => '¿Cuál es la capacidad actual del estadio de la Feixa Llarga?',
                'respuesta' => '6.740 espectadores',
            ],
            [
                'place_id' => 9,
                'pista' => 'Encuentra la Biblioteca Central Tecla Sala en Hospitalet.',
                'validado' => false,
                'prueba' => '¿Qué tipo de edificio industrial era antes de ser biblioteca?',
                'respuesta' => 'Fábrica textil',
            ],
            [
                'place_id' => 10,
                'pista' => 'Visita la Rambla Just Oliveras de Hospitalet.',
                'validado' => false,
                'prueba' => '¿Qué monumento característico se encuentra al inicio de la rambla?',
                'respuesta' => 'La escultura de la amistad',
            ],
        ];

        foreach ($checkpoints as $checkpoint) {
            Checkpoint::create($checkpoint);
        }
    }
}
