<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gimcana extends Model
{
    use HasFactory;

    // Especifica el nombre de la tabla manualmente
    protected $table = 'gimcanas';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'group_id',
        'checkpoint_id',
        'completed',
    ];

    // Relaciones
    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    public function checkpoint()
    {
        return $this->belongsTo(Checkpoint::class);
    }
}
