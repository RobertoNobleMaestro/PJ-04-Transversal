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
        'nombre',
        'group_id',
        'checkpoint_id',
        'completed',
    ];

    // Relaciones

    public function checkpoints()
    {
        return $this->belongsToMany(Checkpoint::class, 'gimcana_checkpoint');
    }

    // Agrega esta relación para acceder al creador a través del grupo
    public function creator()
    {
        return $this->hasOneThrough(
            User::class,
            Group::class,
            'gimcana_id', 
            'id',       
            'id',        
            'creador'     
        );
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }
}
