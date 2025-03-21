<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration
{
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigogrupo')->unique();
            $table->foreignId('creador')->constrained('users');
            // $table->unsignedBigInteger('creador');
            $table->integer('miembros')->default(2);
            // $table->foreign('creador')->references('id')->on('users');
            $table->timestamps();

            // Índices para relaciones rápidas entre usuario 
            // $table->index('creador');
        });
    }

    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
