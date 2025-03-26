<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'direccion', 'coordenadas_lat', 'coordenadas_lon', 'categoria_id', 'etiquetas', 'favorito', 'imagen'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoria_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'place_tag');
    }

    public function checkpoints()
    {
        return $this->hasMany(Checkpoint::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
