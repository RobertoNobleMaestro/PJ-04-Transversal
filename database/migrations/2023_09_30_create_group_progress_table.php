<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupProgressTable extends Migration
{
    public function up()
    {
        Schema::create('group_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups');
            $table->foreignId('checkpoint_id')->constrained('checkpoints');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('timestamp');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('group_progress');
    }
} 