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
                'etiquetas' => json_encode(['museo', 'cultura', 'historia']),
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
                'etiquetas' => json_encode(['parque', 'naturaleza', 'ocio']),
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
                'etiquetas' => json_encode(['centro comercial', 'tiendas', 'restaurantes']),
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
                'etiquetas' => json_encode(['plaza', 'ayuntamiento', 'monumento']),
            ],
            [
                'nombre' => "Sagrada Familia",
                'descripcion' => "Basílica y templo expiatorio diseñado por Antoni Gaudí, uno de los monumentos más visitados de España.",
                'direccion' => "Carrer de Mallorca, 401, 08013 Barcelona",
                'coordenadas_lat' => 41.4036,
                'coordenadas_lon' => 2.1744,
                'categoria_id' => 4, // Monumento
                'favorito' => false,
                'imagen' => 'sagrada-familia.jpg',
                'etiquetas' => json_encode(['basílica', 'templo', 'gaudi']),
            ],
            [
                'nombre' => "Parque Güell",
                'descripcion' => "Parque público con jardines y elementos arquitectónicos diseñados por Antoni Gaudí.",
                'direccion' => "Carrer d'Olot, s/n, 08024 Barcelona",
                'coordenadas_lat' => 41.4145,
                'coordenadas_lon' => 2.1527,
                'categoria_id' => 3, // Parque
                'favorito' => false,
                'imagen' => 'parque-guell.jpg',
                'etiquetas' => json_encode(['parque', 'jardines', 'gaudi']),
            ],
            [
                'nombre' => "Casa Batlló",
                'descripcion' => "Edificio emblemático diseñado por Antoni Gaudí, considerado una obra maestra del modernismo.",
                'direccion' => "Passeig de Gràcia, 43, 08007 Barcelona",
                'coordenadas_lat' => 41.3917,
                'coordenadas_lon' => 2.1649,
                'categoria_id' => 4, // Monumento
                'favorito' => false,
                'imagen' => 'casa-batllo.jpg',
                'etiquetas' => json_encode(['casa', 'gaudi', 'modernismo']),
            ],
            [
                'nombre' => "Mercado de La Boquería",
                'descripcion' => "Mercado emblemático de Barcelona con una gran variedad de productos frescos y gastronomía local.",
                'direccion' => "La Rambla, 91, 08001 Barcelona",
                'coordenadas_lat' => 41.3816,
                'coordenadas_lon' => 2.1715,
                'categoria_id' => 7, // Tienda
                'favorito' => false,
                'imagen' => 'boqueria.jpg',
                'etiquetas' => json_encode(['mercado', 'productos frescos', 'gastronomía']),
            ],
            [
                'nombre' => "Playa de la Barceloneta",
                'descripcion' => "Una de las playas más populares de Barcelona, ideal para disfrutar del sol y el mar.",
                'direccion' => "Passeig Marítim de la Barceloneta, 08003 Barcelona",
                'coordenadas_lat' => 41.3788,
                'coordenadas_lon' => 2.1925,
                'categoria_id' => 5, // Playa
                'favorito' => false,
                'imagen' => 'barceloneta.jpg',
                'etiquetas' => json_encode(['playa', 'sol', 'mar']),
            ],
            [
                'nombre' => "Restaurante Can Culleretes",
                'descripcion' => "El restaurante más antiguo de Barcelona, fundado en 1786, con cocina catalana tradicional.",
                'direccion' => "Carrer d'en Quintana, 5, 08002 Barcelona",
                'coordenadas_lat' => 41.3822,
                'coordenadas_lon' => 2.1739,
                'categoria_id' => 6, // Restaurante
                'favorito' => false,
                'imagen' => 'can-culleretes.jpg',
                'etiquetas' => json_encode(['restaurante', 'cocina catalana', 'tradicional']),
            ],
            [
                'nombre' => "Hotel Arts Barcelona",
                'descripcion' => "Hotel de lujo situado frente al mar con vistas impresionantes de la ciudad y el Mediterráneo.",
                'direccion' => "Carrer de la Marina, 19-21, 08005 Barcelona",
                'coordenadas_lat' => 41.3865,
                'coordenadas_lon' => 2.1963,
                'categoria_id' => 8, // Hotel
                'favorito' => false,
                'imagen' => 'hotel-arts.jpg',
                'etiquetas' => json_encode(['hotel', 'lujo', 'vistas']),
            ],
            [
                'nombre' => "Café de l'Òpera",
                'descripcion' => "Café histórico situado en Las Ramblas, con más de 150 años de historia.",
                'direccion' => "La Rambla, 74, 08002 Barcelona",
                'coordenadas_lat' => 41.3802,
                'coordenadas_lon' => 2.1742,
                'categoria_id' => 9, // Cafetería
                'favorito' => false,
                'imagen' => 'cafe-opera.jpg',
                'etiquetas' => json_encode(['café', 'histórico', 'ramblas']),
            ],
            [
                'nombre' => "Bar Marsella",
                'descripcion' => "Uno de los bares más antiguos de Barcelona, famoso por su absenta y su decoración original.",
                'direccion' => "Carrer de Sant Pau, 65, 08001 Barcelona",
                'coordenadas_lat' => 41.3785,
                'coordenadas_lon' => 2.1697,
                'categoria_id' => 10, // Bar
                'favorito' => false,
                'imagen' => 'bar-marsella.jpg',
                'etiquetas' => json_encode(['bar', 'absenta', 'decoración']),
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
                'etiquetas' => json_encode(['mercado', 'productos frescos', 'locales']),
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
                'etiquetas' => json_encode(['parque', 'zonas deportivas', 'áreas verdes']),
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
                'etiquetas' => json_encode(['teatro', 'espectáculos culturales', 'obras de teatro']),
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
                'etiquetas' => json_encode(['estadio', 'fútbol', 'CE L’Hospitalet']),
            ],
        ];

        foreach ($places as $place) {
            Place::create($place);
        }
    }
}
