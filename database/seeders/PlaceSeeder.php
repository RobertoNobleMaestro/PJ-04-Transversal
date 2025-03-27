<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Place;

class PlaceSeeder extends Seeder
{
    public function run(): void
    {
        $places = [
            // Museos
            ['nombre' => "Museu de L'Hospitalet", 'descripcion' => "Museo de historia y cultura de L'Hospitalet.", 'direccion' => "Carrer del Xipreret, 22", 'coordenadas_lat' => 41.3599, 'coordenadas_lon' => 2.0991, 'categoria_id' => 1, 'favorito' => false, 'imagen' => 'museo.jpg', 'etiquetas' => json_encode(['museo', 'cultura', 'historia'])],
            ['nombre' => "Museo de Historia de Barcelona", 'descripcion' => "Explora la historia de la ciudad desde sus orígenes romanos.", 'direccion' => "Plaça del Rei, s/n", 'coordenadas_lat' => 41.3834, 'coordenadas_lon' => 2.1761, 'categoria_id' => 1, 'favorito' => false, 'imagen' => 'museo-historia.jpg', 'etiquetas' => json_encode(['historia', 'cultura', 'arqueología'])],
        
            // Centros Comerciales
            ['nombre' => "La Farga Centro Comercial", 'descripcion' => "Centro comercial con tiendas y restaurantes.", 'direccion' => "Carrer de Barcelona, 2", 'coordenadas_lat' => 41.3594, 'coordenadas_lon' => 2.0993, 'categoria_id' => 2, 'favorito' => false, 'imagen' => 'centro-comercial.jpg', 'etiquetas' => json_encode(['tiendas', 'ocio', 'compras'])],
            ['nombre' => "Gran Via 2", 'descripcion' => "Centro comercial moderno con una gran variedad de tiendas y restaurantes.", 'direccion' => "Av. de la Granvia de l’Hospitalet, 75", 'coordenadas_lat' => 41.3544, 'coordenadas_lon' => 2.1286, 'categoria_id' => 2, 'favorito' => false, 'imagen' => 'granvia2.jpg', 'etiquetas' => json_encode(['compras', 'ocio', 'moda'])],
        
            // Parques
            ['nombre' => "Parc de Can Buxeres", 'descripcion' => "Parque con amplias zonas verdes.", 'direccion' => "Av. Josep Tarradellas i Joan, 44", 'coordenadas_lat' => 41.3671, 'coordenadas_lon' => 2.1025, 'categoria_id' => 3, 'favorito' => false, 'imagen' => 'parque.jpg', 'etiquetas' => json_encode(['naturaleza', 'paseo', 'familia'])],
        
            // Monumentos
            ['nombre' => "Plaça de l'Ajuntament", 'descripcion' => "Plaza principal de L'Hospitalet.", 'direccion' => "Plaça de l'Ajuntament", 'coordenadas_lat' => 41.3590, 'coordenadas_lon' => 2.0975, 'categoria_id' => 4, 'favorito' => false, 'imagen' => 'plaza.jpg', 'etiquetas' => json_encode(['plaza', 'monumento', 'historia'])],
        
            // Playas
            ['nombre' => "Playa de la Barceloneta", 'descripcion' => "Una de las playas más famosas de Barcelona.", 'direccion' => "Passeig Marítim de la Barceloneta", 'coordenadas_lat' => 41.3765, 'coordenadas_lon' => 2.1925, 'categoria_id' => 5, 'favorito' => false, 'imagen' => 'barceloneta.jpg', 'etiquetas' => json_encode(['playa', 'sol', 'arena'])],
        
            // Restaurantes
            ['nombre' => "Restaurante Can Culleretes", 'descripcion' => "Cocina catalana tradicional.", 'direccion' => "Carrer d'en Quintana, 5", 'coordenadas_lat' => 41.3822, 'coordenadas_lon' => 2.1739, 'categoria_id' => 6, 'favorito' => false, 'imagen' => 'can-culleretes.jpg', 'etiquetas' => json_encode(['gastronomía', 'historia', 'catalán'])],
            ['nombre' => "Tickets", 'descripcion' => "Innovador restaurante de tapas dirigido por los hermanos Adrià.", 'direccion' => "Av. del Paral·lel, 164", 'coordenadas_lat' => 41.3757, 'coordenadas_lon' => 2.1543, 'categoria_id' => 6, 'favorito' => false, 'imagen' => 'tickets.jpg', 'etiquetas' => json_encode(['gastronomía', 'tapas', 'creativo'])],
        
            // Tiendas y Mercados
            ['nombre' => "Mercado de La Boquería", 'descripcion' => "Mercado icónico de Barcelona.", 'direccion' => "La Rambla, 91", 'coordenadas_lat' => 41.3816, 'coordenadas_lon' => 2.1715, 'categoria_id' => 7, 'favorito' => false, 'imagen' => 'boqueria.jpg', 'etiquetas' => json_encode(['mercado', 'productos frescos', 'gastronomía'])],
        
            // Hoteles
            ['nombre' => "W Barcelona", 'descripcion' => "Hotel icónico con forma de vela en la playa de Barcelona.", 'direccion' => "Plaça de la Rosa dels Vents, 1", 'coordenadas_lat' => 41.3680, 'coordenadas_lon' => 2.1903, 'categoria_id' => 8, 'favorito' => false, 'imagen' => 'hotel-w.jpg', 'etiquetas' => json_encode(['lujo', 'playa', 'vistas'])],
        
            // Cafeterías
            ['nombre' => "Satan’s Coffee Corner", 'descripcion' => "Cafetería hipster con café de especialidad.", 'direccion' => "Carrer de l’Arc de Sant Ramon del Call, 11", 'coordenadas_lat' => 41.3820, 'coordenadas_lon' => 2.1770, 'categoria_id' => 9, 'favorito' => false, 'imagen' => 'satans-coffee.jpg', 'etiquetas' => json_encode(['café', 'especialidad', 'hipster'])],
        
            // Baress
            ['nombre' => "Paradiso", 'descripcion' => "Speakeasy famoso por sus cócteles innovadores.", 'direccion' => "Carrer de Rera Palau, 4", 'coordenadas_lat' => 41.3836, 'coordenadas_lon' => 2.1822, 'categoria_id' => 10, 'favorito' => false, 'imagen' => 'paradiso.jpg', 'etiquetas' => json_encode(['bar', 'cócteles', 'secreto'])],
        
            // Teatros
            ['nombre' => "Gran Teatre del Liceu", 'descripcion' => "Ópera y espectáculos de gran renombre en Las Ramblas.", 'direccion' => "La Rambla, 51-59", 'coordenadas_lat' => 41.3809, 'coordenadas_lon' => 2.1730, 'categoria_id' => 12, 'favorito' => false, 'imagen' => 'liceu.jpg', 'etiquetas' => json_encode(['ópera', 'cultura', 'teatro'])],
        
            // Estadios
            ['nombre' => "Spotify Camp Nou", 'descripcion' => "Estadio del FC Barcelona y museo del club.", 'direccion' => "Carrer d'Arístides Maillol, 12", 'coordenadas_lat' => 41.3809, 'coordenadas_lon' => 2.1228, 'categoria_id' => 13, 'favorito' => false, 'imagen' => 'camp-nou.jpg', 'etiquetas' => json_encode(['fútbol', 'deporte', 'historia'])],
        ];
        
        foreach ($places as $place) {
            Place::create($place);
        }
        
    }
    // pruebvhsjgfkba 
    // svrh antbrj
}
