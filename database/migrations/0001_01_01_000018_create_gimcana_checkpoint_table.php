<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGimcanaCheckpointTable extends Migration
{
    public function up()
    {
        Schema::create('gimcana_checkpoint', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gimcana_id')->constrained('gimcanas');
            $table->foreignId('checkpoint_id')->constrained('checkpoints');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gimcana_checkpoint');
    }
} 