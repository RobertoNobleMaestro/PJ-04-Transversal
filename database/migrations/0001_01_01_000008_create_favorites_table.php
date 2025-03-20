<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    public function up()
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('place_id')->constrained('places')->onDelete('cascade');
            $table->timestamps();

            // Índices para relaciones rápidas entre usuario y lugar
            $table->index('user_id');
            $table->index('place_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('favorites');
    }
}
