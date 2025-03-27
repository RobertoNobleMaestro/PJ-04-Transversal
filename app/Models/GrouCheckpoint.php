<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupCheckpoint extends Model
{
    use HasFactory;

    // Especificar explícitamente el nombre de la tabla
    protected $table = 'group_checkpoint';
    
    protected $fillable = ['groupuser_id', 'checkpoint_id', 'validado'];

    public function groupUser()
    {
        return $this->belongsTo(GroupUser::class, 'groupuser_id');
    }

    public function checkpoint()
    {
        return $this->belongsTo(Checkpoint::class);
    }

    public function validarCheckpoint()
    {
        $this->update(['validado' => true]);
    }
}
