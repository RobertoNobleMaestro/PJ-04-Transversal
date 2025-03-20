<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceTag extends Model
{
    use HasFactory;

    protected $table = 'place_tag';

    protected $fillable = ['place_id', 'tag_id'];

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }
}
