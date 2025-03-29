<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Place;
use App\Models\Gimcana;
use App\Models\Checkpoint;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class BellvitgeGimcanaSeeder extends Seeder
{
    /**
     * Seed una gimcana completa en Bellvitge
     */
    public function run()
    {
        // Asegurar que tenemos una categoría para estos lugares
        $categoryId = Category::firstOrCreate(['name' => 'Monumento'])->id;
        $restaurantCategoryId = Category::firstOrCreate(['name' => 'Restaurante'])->id;
        
        // 1. Crear la gimcana
        $gimcana = Gimcana::create([
            'nombre' => 'Descubriendo Bellvitge',
            'completed' => false
        ]);
        
        // 2. Crear lugares emblemáticos de Bellvitge con coordenadas reales
        $places = [
            [
                'nombre' => 'Estación de Tren de Bellvitge',
                'descripcion' => 'Estación de tren de Rodalies que conecta Bellvitge con Barcelona y otras localidades',
                'direccion' => 'Av. Mare de Déu de Bellvitge, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3548270,
                'coordenadas_lon' => 2.1152056,
                'categoria_id' => $categoryId,
                'favorito' => false,
                'imagen' => 'tren_bellvitge.jpg',
            ], 
            [
                'nombre' => 'Pirulo de Bellvitge',
                'descripcion' => 'Monumento emblemático del barrio de Bellvitge, un hito reconocible para todos los vecinos',
                'direccion' => 'Av. Europa, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.35273586929172,
                'coordenadas_lon' => 2.1132156631630927,
                'categoria_id' => $categoryId,
                'favorito' => false,
                'imagen' => 'pirulo_bellvitge.jpg',
            ],
            [ 
                'nombre' => 'Restaurante La Flama',
                'descripcion' => 'Popular restaurante del barrio de Bellvitge donde se puede disfrutar de buena comida',
                'direccion' => 'Av. Europa, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.35154553752725,
                'coordenadas_lon' => 2.111454314357429,
                'categoria_id' => $restaurantCategoryId,
                'favorito' => false,
                'imagen' => 'restaurante_flama.jpg',
            ],
            [
                'nombre' => 'Metro de Bellvitge',
                'descripcion' => 'Estación de metro de la línea L1 que da servicio al barrio de Bellvitge',
                'direccion' => 'Rambla Marina, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3512458,
                'coordenadas_lon' => 2.1109213,
                'categoria_id' => $categoryId,
                'favorito' => false,
                'imagen' => 'metro_bellvitge.jpg',
            ],
        ];
        
        // Guardar los lugares en la base de datos
        $createdPlaces = [];
        foreach ($places as $placeData) {
            $place = Place::create($placeData);
            $createdPlaces[] = $place;
        }
        
        // 3. Crear checkpoints con pistas y pruebas
        $checkpoints = [
            [
                'place_id' => $createdPlaces[0]->id, // Estación de Tren de Bellvitge
                'validado' => false,
                'pista' => 'Busca el lugar donde los trenes conectan Bellvitge con Barcelona y otras localidades. Un punto de partida para muchos viajeros.',
                'prueba' => '¿Cuántas vías principales tiene esta estación de tren?',
                'respuesta' => '2',
            ],
            [
                'place_id' => $createdPlaces[1]->id, // Pirulo de Bellvitge
                'validado' => false,
                'pista' => 'Busca el monumento emblemático del barrio, una estructura vertical que sirve como punto de encuentro para los panas.',
                'prueba' => '¿Que forma tiene el Pirulo de Bellvitge?',
                'respuesta' => 'redonda',
            ],
            [
                'place_id' => $createdPlaces[2]->id, // Restaurante La Flama
                'validado' => false,
                'pista' => 'Busca este popular restaurante del barrio donde muchos vecinos van a comer. Su nombre hace referencia al fuego.',
                'prueba' => '¿Cuál es el plato más famoso de este restaurante?',
                'respuesta' => 'paella',
            ],
            [
                'place_id' => $createdPlaces[3]->id, // Metro de Bellvitge
                'validado' => false,
                'pista' => 'El último punto de nuestra aventura. Busca la entrada a la red subterránea de transporte que conecta con toda la ciudad.',
                'prueba' => '¿De qué color es la línea de metro que pasa por esta estación?',
                'respuesta' => 'rojo',
            ],
        ];
        
        // Guardar los checkpoints y asociarlos a la gimcana
        foreach ($checkpoints as $index => $checkpointData) {
            $checkpoint = Checkpoint::create($checkpointData);
            
            // Asociar a la gimcana usando la tabla pivote
            DB::table('gimcana_checkpoint')->insert([
                'gimcana_id' => $gimcana->id,
                'checkpoint_id' => $checkpoint->id
            ]);
        }
    }
}
