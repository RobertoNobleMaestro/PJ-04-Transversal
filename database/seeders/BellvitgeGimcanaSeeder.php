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
        
        // 1. Crear la gimcana
        $gimcana = Gimcana::create([
            'nombre' => 'Descubriendo Bellvitge',
            'completed' => false
        ]);
        
        // 2. Crear lugares emblemáticos de Bellvitge con coordenadas reales
        $places = [
            [
                'nombre' => 'Colegio Juan XXIII - Jesuïtes Bellvitge',
                'descripcion' => 'Centro educativo fundado en 1968, gestionado por los Jesuitas y uno de los colegios más emblemáticos de Bellvitge',
                'direccion' => 'Av. Mare de Déu de Bellvitge 100-110, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3484,
                'coordenadas_lon' => 2.1089,
                'categoria_id' => $categoryId,
                'favorito' => false,
                'imagen' => 'colegio_juan23.jpg',
            ],
            [
                'nombre' => 'Hospital Universitario de Bellvitge',
                'descripcion' => 'Uno de los hospitales más importantes de Cataluña, referente en investigación médica',
                'direccion' => 'Carrer de la Feixa Llarga, s/n, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3428,
                'coordenadas_lon' => 2.1023,
                'categoria_id' => $categoryId,
                'imagen' => 'hospital_bellvitge.jpg',
            ],
            [
                'nombre' => 'Parque de Bellvitge',
                'descripcion' => 'Gran parque urbano con zonas verdes, áreas de recreo y espacios para actividades',
                'direccion' => 'Avinguda d\'Amèrica, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3500,
                'coordenadas_lon' => 2.1056,
                'categoria_id' => $categoryId,
                'imagen' => 'parque_bellvitge.jpg',
            ],
            [
                'nombre' => 'Centro Comercial Gran Vía 2',
                'descripcion' => 'Centro comercial con gran variedad de tiendas, restaurantes y zona de ocio',
                'direccion' => 'Av. de la Granvia, 75, 08908 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3583,
                'coordenadas_lon' => 2.1281,
                'categoria_id' => $categoryId,
                'imagen' => 'granvia2.jpg',
            ],
            [
                'nombre' => 'Torre Barró',
                'descripcion' => 'Uno de los edificios más altos y emblemáticos de Bellvitge',
                'direccion' => 'Av. Europa, 08907 L\'Hospitalet de Llobregat',
                'coordenadas_lat' => 41.3467,
                'coordenadas_lon' => 2.1092,
                'categoria_id' => $categoryId,
                'imagen' => 'torre_barro.jpg',
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
                'place_id' => $createdPlaces[0]->id, // Colegio Juan XXIII
                'validado' => false,
                'pista' => 'Busca este centro educativo gestionado por los Jesuitas, un referente en Bellvitge desde 1968.',
                'prueba' => '¿En qué año fue fundado este colegio?',
                'respuesta' => '1968',
            ],
            [
                'place_id' => $createdPlaces[1]->id, // Hospital Universitario
                'validado' => false,
                'pista' => 'Este gran edificio salva vidas y es un centro de investigación médica de referencia. Busca el gigante blanco de Bellvitge.',
                'prueba' => '¿Cuántos pisos tiene el edificio principal del Hospital de Bellvitge?',
                'respuesta' => '11',
            ],
            [
                'place_id' => $createdPlaces[2]->id, // Parque de Bellvitge
                'validado' => false,
                'pista' => 'Zona verde entre bloques de edificios. Un oasis urbano donde familias y niños disfrutan al aire libre.',
                'prueba' => 'Cuenta el número de fuentes de agua potable que hay en el parque y suma todos los dígitos.',
                'respuesta' => '4',
            ],
            [
                'place_id' => $createdPlaces[3]->id, // Centro Comercial Gran Vía 2
                'validado' => false,
                'pista' => 'Donde compras, comes y te diviertes. Un gran edificio con muchas tiendas cerca de la Fira.',
                'prueba' => '¿En qué año fue inaugurado este centro comercial? (Pista: Busca una placa conmemorativa o pregunta a algún trabajador)',
                'respuesta' => '2002',
            ],
            [
                'place_id' => $createdPlaces[4]->id, // Torre Barró
                'validado' => false,
                'pista' => 'Uno de los edificios más altos del barrio. Desde lejos se ve su silueta característica.',
                'prueba' => '¿Cuántas letras componen el nombre que ves en la entrada principal del edificio?',
                'respuesta' => '10',
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
