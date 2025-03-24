<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->timestamps();

            // Índice por nombre para búsquedas rápidas
            $table->index('nombre');
        });
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
}