<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlacesTable extends Migration
{
    public function up()
    {
        Schema::create('places', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion');
            $table->decimal('coordenadas_lat', 9, 6);
            $table->decimal('coordenadas_lon', 9, 6);
            $table->string('direccion');
            $table->foreignId('categoria_id')->constrained('categories')->onDelete('restrict');
            $table->boolean('favorito')->default(false);
            $table->string('imagen')->nullable();
            $table->timestamps();
            // Índice compuesto para búsquedas rápidas por coordenadas y categoría
            $table->index(['coordenadas_lat', 'coordenadas_lon']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('places');
    }
}
