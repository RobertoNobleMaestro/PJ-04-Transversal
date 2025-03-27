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
            $table->string('codigogrupo')->nullable();
            $table->string('nombre');
            $table->enum('estado', ['Espera', 'Completo', 'Empezado'])->default('Espera');
            $table->foreignId('creador')->constrained('users');
            $table->foreignId('gimcana_id')->constrained('gimcanas');
            $table->integer('miembros')->default(2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
