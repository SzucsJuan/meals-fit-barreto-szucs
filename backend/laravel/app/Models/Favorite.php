<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    public $timestamps = true;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $table = 'favorites';
    protected $fillable = ['user_id','recipe_id'];

    public function user()   { return $this->belongsTo(User::class); }
    public function recipe() { return $this->belongsTo(Recipe::class); }
}
