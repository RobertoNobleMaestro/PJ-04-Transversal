<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'codigogrupo', 'creator_id', 'miembros'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function creador()
    {
        return $this->creator();
    }

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

    public function gimcana()
    {
        return $this->belongsTo(Gimcana::class);
    }

    public function gimcanas()
    {
        return $this->hasMany(Gimcana::class);
    }
}
