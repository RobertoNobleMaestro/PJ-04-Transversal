<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'fecha_creacion', 'miembros'];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function checkpoints()
    {
        return $this->belongsToMany(Checkpoint::class, 'group_checkpoint');
    }

    public function gamifications()
    {
        return $this->hasMany(Gamification::class);
    }
}
