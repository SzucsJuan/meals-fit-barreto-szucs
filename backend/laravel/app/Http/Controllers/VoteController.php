<?php


namespace App\Http\Controllers;


use App\Models\Vote;
use App\Http\Requests\VoteStoreRequest;


class VoteController extends Controller
{
    public function store(VoteStoreRequest $request)
    {
        $vote = Vote::updateOrCreate(
            ['user_id' => auth()->id(), 'recipe_id' => $request->recipe_id],
            ['rating' => $request->rating]
        );
        return $vote;
    }
}