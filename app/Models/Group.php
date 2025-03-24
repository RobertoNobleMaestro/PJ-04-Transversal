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
        return $this->belongsToMany(User::class, 'group_user');
    }

    public function checkpoints()
    {
        return $this->belongsToMany(Checkpoint::class, 'group_checkpoint');
    }

    public function groupUsers()
    {
        return $this->hasMany(GroupUser::class);
    }

    public function gimcanas()
    {
        return $this->belongsToMany(Gimcana::class, 'gimcana_group');
    }
}
