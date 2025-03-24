<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Place;
use App\Models\Tag;

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
                'favorito' => false,
                'imagen' => 'parque.jpg',
            ],
            [
                'nombre' => "La Farga Centro Comercial",
                'descripcion' => "Un centro comercial con una amplia variedad de tiendas y restaurantes.",
                'direccion' => "Carrer de Barcelona, 2, 08901 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3594,
                'coordenadas_lon' => 2.0993,
                'categoria_id' => 2, // Centro Comercial
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
                'favorito' => false,
                'imagen' => 'plaza.jpg',
            ],
            // NUEVOS LUGARES
            [
                'nombre' => "Mercat de Santa Eulàlia",
                'descripcion' => "Mercado con productos frescos y locales.",
                'direccion' => "Carrer Pareto, 08902 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3630,
                'coordenadas_lon' => 2.1045,
                'categoria_id' => 5, // Mercado
                'favorito' => false,
                'imagen' => 'mercado.jpg',
            ],
            [
                'nombre' => "Parc de la Torrassa",
                'descripcion' => "Un parque con zonas deportivas y áreas verdes.",
                'direccion' => "Carrer de Albareda, 08903 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3705,
                'coordenadas_lon' => 2.1070,
                'categoria_id' => 3, // Parque
                'favorito' => false,
                'imagen' => 'parc-torrassa.jpg',
            ],
            [
                'nombre' => "Teatre Joventut",
                'descripcion' => "Un teatro con espectáculos culturales y obras de teatro.",
                'direccion' => "Carrer de la Joventut, 4, 08904 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3648,
                'coordenadas_lon' => 2.1091,
                'categoria_id' => 6, // Teatro
                'favorito' => false,
                'imagen' => 'teatro.jpg',
            ],
            [
                'nombre' => "Estadi Municipal de Futbol de L’Hospitalet",
                'descripcion' => "Campo de fútbol donde juega el CE L’Hospitalet.",
                'direccion' => "Carrer de la Feixa Llarga, 08907 L'Hospitalet de Llobregat, Barcelona",
                'coordenadas_lat' => 41.3556,
                'coordenadas_lon' => 2.1134,
                'categoria_id' => 7, // Estadio
                'favorito' => false,
                'imagen' => 'estadio.jpg',
            ],
        ];

        foreach ($places as $place) {
            Place::create($place);
        }
    }
}
