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
            $table->timestamp('fecha_creacion')->useCurrent();
            //limite de miembros por cada grupo
            $table->integer('miembros')->default(4);
            $table->timestamps();
            // Índice por nombre para búsquedas rápidas
            $table->index('nombre');
        });
    }

    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
