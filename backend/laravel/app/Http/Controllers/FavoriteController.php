<?php


namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Recipe;


class FavoriteController extends Controller
{
public function toggle(Recipe $recipe){
/** @var \App\Models\User $user */
$user = auth()->user();
$user->favorites()->toggle($recipe->id);
}
}