<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupCheckpointTable extends Migration
{
    public function up()
    {
        Schema::create('group_checkpoint', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groupuser_id')->constrained('group_users');
            $table->foreignId('checkpoint_id')->constrained('checkpoints');
            $table->timestamps();
            // Índices para relaciones rápidas entre grupos y puntos de control
            $table->index('group_id');
            $table->index('checkpoint_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('group_checkpoint');
    }
}
