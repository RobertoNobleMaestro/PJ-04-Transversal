<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupUser extends Model
{
    use HasFactory;

    protected $fillable = ['group_id', 'user_id'];

    public function usuarios()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function grupo()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
