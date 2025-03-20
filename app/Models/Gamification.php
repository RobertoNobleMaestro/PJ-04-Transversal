<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gamification extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'checkpoint_id', 'completed'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function checkpoint()
    {
        return $this->belongsTo(Checkpoint::class);
    }
}
