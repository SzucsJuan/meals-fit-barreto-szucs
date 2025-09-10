<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\MealDetail;

class MealLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function details()
    {
        return $this->hasMany(MealDetail::class);
    }
}