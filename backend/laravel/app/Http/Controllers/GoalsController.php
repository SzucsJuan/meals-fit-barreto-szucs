<?php

namespace App\Http\Controllers;

use App\Http\Requests\GoalRequest;
use App\Services\GoalGenerator;
use Illuminate\Http\Request;

class GoalsController extends Controller
{
    public function __construct(private GoalGenerator $service) {}

    /** POST /api/me/goals?source=ai|rule (default: ai con fallback) */
    public function store(GoalRequest $req)
    {
        $user  = $req->user();
        $input = $req->validated();
        $sourceParam = $req->query('source', 'ai');

        $metrics = null;
        $usedSource = 'rule';
        $aiCtx = null;

        if ($sourceParam === 'ai') {
            try {
                $metrics = $this->service->generateByAI($user, $input);
                $usedSource = 'ai';
                $aiCtx = [
                    'model'  => config('services.openai.model', 'gpt-4o-mini'),
                    'prompt' => 'goal-generation-v1', // opcional: guarda el template
                    'raw'    => null, // si querés guardar el JSON crudo, podés hacerlo en el servicio
                ];
            } catch (\Throwable $e) {
                // log optional
                $metrics = $this->service->generateByRules($user, $input);
                $usedSource = 'rule';
            }
        } else {
            $metrics = $this->service->generateByRules($user, $input);
            $usedSource = 'rule';
        }

        $plan = $this->service->upsertPlan($user, $metrics, $input, $usedSource, $aiCtx);

        return response()->json(['plan' => $plan], 201);
    }

    /** GET /api/me/goals/latest */
    public function latest(Request $req)
    {
        $plan = $req->user()->nutritionPlans()->latest('effective_from')->first();
        return response()->json(['plan' => $plan]);
    }
}
