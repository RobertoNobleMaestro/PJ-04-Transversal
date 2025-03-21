<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkpoint extends Model
{
    use HasFactory;

    protected $fillable = ['place_id', 'pista', 'prueba', 'gimcana_id'];

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_checkpoint');
    }

    public function gimcana()
    {
        return $this->belongsTo(Gimcana::class);
    }
}

