<?php
// database/migrations/xxxx_xx_xx_create_gamification_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamificationTable extends Migration
{
    public function up()
    {
        Schema::create('gamification', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups');
            $table->foreignId('checkpoint_id')->constrained('checkpoints');
            $table->boolean('completed')->default(false);
            $table->timestamps();

            // Índices para relaciones rápidas entre grupo y checkpoint
            $table->index('group_id');
            $table->index('checkpoint_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('gamification');
    }
}
