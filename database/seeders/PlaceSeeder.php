<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Place;

class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $places = [
            [
                'name' => 'Museu de L’Hospitalet',
                'address' => 'Carrer del Xipreret, 22, 08901 L’Hospitalet de Llobregat, Barcelona',
                'latitude' => 41.3599,
                'longitude' => 2.0991,
                'category_id' => 1, // Museo
            ],
            [
                'name' => 'Parc de Can Buxeres',
                'address' => 'Av. Josep Tarradellas i Joan, 44, 08901 L’Hospitalet de Llobregat, Barcelona',
                'latitude' => 41.3671,
                'longitude' => 2.1025,
                'category_id' => 3, // Parque
            ],
            [
                'name' => 'La Farga Centro Comercial',
                'address' => 'Carrer de Barcelona, 2, 08901 L’Hospitalet de Llobregat, Barcelona',
                'latitude' => 41.3594,
                'longitude' => 2.0993,
                'category_id' => 2, // Centro Comercial/Restaurantes
            ],
            [
                'name' => 'Plaça de l’Ajuntament',
                'address' => 'Plaça de l’Ajuntament, 08901 L’Hospitalet de Llobregat, Barcelona',
                'latitude' => 41.3590,
                'longitude' => 2.0975,
                'category_id' => 4, // Monumento
            ],
        ];

        foreach ($places as $place) {
            Place::create($place);
        }
    }
}
