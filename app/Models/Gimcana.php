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
    public function checkpoints()
    {
        return $this->belongsToMany(Checkpoint::class, 'gimcana_checkpoint')->withTimestamps();
    }

    // Agrega esta relación para acceder al creador a través del grupo
    public function creator()
    {
        return $this->hasOneThrough(
            User::class,
            Group::class,
            'id', // Foreign key on groups table
            'id', // Foreign key on users table
            'group_id', // Local key on gimcanas table
            'creador' // Local key on groups table
        );
    }
}
