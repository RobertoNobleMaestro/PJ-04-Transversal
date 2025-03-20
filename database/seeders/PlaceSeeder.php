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
                'nombre' => "Museu de L'Hospitalet",
                'descripcion' => "Un museo dedicado a la historia y cultura de L'Hospitalet.",
                'direccion' => "Carrer del Xipreret, 22, 08901 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3599,
                'coordenadas_lon' => 2.0991,
                'categoria_id' => 1, // Museo
                'etiquetas' => 'Historia, Cultura',
                'favorito' => false,
                'imagen' => 'museo.jpg',
            ],
            [
                'nombre' => "Parc de Can Buxeres",
                'descripcion' => "Un parque ideal para pasear y disfrutar de la naturaleza.",
                'direccion' => "Av. Josep Tarradellas i Joan, 44, 08901 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3671,
                'coordenadas_lon' => 2.1025,
                'categoria_id' => 3, // Parque
                'etiquetas' => 'Naturaleza, Relax',
                'favorito' => false,
                'imagen' => 'parque.jpg',
            ],
            [
                'nombre' => "La Farga Centro Comercial",
                'descripcion' => "Un centro comercial con una amplia variedad de tiendas y restaurantes.",
                'direccion' => "Carrer de Barcelona, 2, 08901 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3594,
                'coordenadas_lon' => 2.0993,
                'categoria_id' => 2, // Centro Comercial/Restaurantes
                'etiquetas' => 'Compras, Gastronomía',
                'favorito' => false,
                'imagen' => 'centro-comercial.jpg',
            ],
            [
                'nombre' => "Plaça de l'Ajuntament",
                'descripcion' => "La plaza principal del Ayuntamiento de L'Hospitalet.",
                'direccion' => "Plaça de l'Ajuntament, 08901 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3590,
                'coordenadas_lon' => 2.0975,
                'categoria_id' => 4, // Monumento
                'etiquetas' => 'Historia, Arquitectura',
                'favorito' => false,
                'imagen' => 'plaza.jpg',
            ],
        ];

        foreach ($places as $place) {
            Place::create($place);
        }
    }
}