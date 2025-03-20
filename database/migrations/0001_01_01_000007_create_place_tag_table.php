<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlaceTagTable extends Migration
{
    public function up()
    {
        Schema::create('place_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('place_id')->constrained('places')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
            $table->timestamps();

            // Índices adicionales para búsquedas rápidas en las relaciones
            $table->index('place_id');
            $table->index('tag_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('place_tag');
    }
}
