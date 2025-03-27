<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCheckpointsTable extends Migration
{
    public function up()
    {
        Schema::create('checkpoints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('place_id')->constrained('places');
            $table->boolean('validado')->default(false);
            $table->text('pista');
            $table->text('prueba');
            $table->text('respuesta');
            $table->timestamps();

            // Índice en la relación con lugares (places)
            $table->index('place_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('checkpoints');
    }
}
