<?php

namespace App\Http\Controllers;

use App\Http\Requests\GoalRequest;
use App\Services\GoalGenerator;
use Illuminate\Http\Request;

class GoalsController extends Controller
{
    public function __construct(private GoalGenerator $service) {}

    /** POST /api/me/goals?source=ai|rule */
    public function store(GoalRequest $req)
    {
        $user  = $req->user();
        $input = $req->validated();
        $sourceParam = $req->query('source', 'ai');

        // Si llegan métricas personales, actualizamos el perfil del usuario:
        $dirty = [];
        foreach (['age','weight','height'] as $k) {
            if (array_key_exists($k, $input) && $input[$k] !== null) {
                $dirty[$k] = $input[$k];
            }
        }
        if ($dirty) {
            $user->update($dirty);
        }

        $usedSource = 'rule';
        $aiCtx = null;
        $metrics = null;

        if ($sourceParam === 'ai') {
            try {
                $ai = $this->service->generateByAI($user, $input);
                $metrics = $ai['metrics'];
                $usedSource = 'ai';
                $aiCtx = [
                    'model'  => $ai['model'] ?? config('services.openai.model', 'gpt-4o-mini'),
                    'prompt' => $ai['prompt'] ?? 'goal-generation-v1',
                    'raw'    => $ai['raw'] ?? null,
                ];
            } catch (\Throwable $e) {
                \Log::warning('AI goal generation failed', [
                    'user_id' => $user->id,
                    'error'   => $e->getMessage(),
                ]);
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
