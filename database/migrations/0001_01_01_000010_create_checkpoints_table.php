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
            $table->foreignId('gymkhana_id')->constrained('gymkhanas');
            $table->foreignId('place_id')->constrained('places');
            $table->text('hint');
            $table->text('challenge');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('checkpoints');
    }
} 