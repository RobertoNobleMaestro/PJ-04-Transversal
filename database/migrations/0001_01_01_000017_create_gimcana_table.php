<?php
// database/migrations/xxxx_xx_xx_create_Gimcana_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGimcanaTable extends Migration
{
    public function up()
    {
        Schema::create('gimcanas', function (Blueprint $table) {
            $table->id();
            $table->text('nombre');
            $table->foreignId('group_id')->constrained('groups');
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gimcanas');
    }
}
