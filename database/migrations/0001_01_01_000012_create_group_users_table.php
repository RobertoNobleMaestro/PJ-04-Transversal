<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupUserTable extends Migration
{
    public function up()
    {
        Schema::create('group_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Índices para relaciones rápidas entre usuarios y grupos
            $table->index('group_id');
            $table->index('user_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('group_user');
    }
}

