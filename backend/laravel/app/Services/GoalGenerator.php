<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNutritionPlan;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class GoalGenerator
{
    public function generateByRules(User $u, array $input): array
    {
        [$sex, $age, $heightCm, $weightKg] = [
            strtolower((string)($u->sex ?? 'm')),  
            (int)($u->age ?? 25),
            (float)($u->height ?? 175),   
            (float)($u->weight ?? 75),    
        ];

        $activityFactor = $this->activityFactor($input['activity_level']);
        $bmr = $this->bmrMifflinStJeor($sex, $weightKg, $heightCm, $age);
        $tdee = $bmr * $activityFactor;

        $calTarget = match ($input['mode']) {
            'maintenance' => $tdee,
            'gain'        => $tdee * 1.12,
            'loss'        => $tdee * 0.825
        };

        $proteinPerKg = match ($input['experience']) {
            'beginner'     => 1.7,
            'advanced'     => 1.9,
            'professional' => 2.1,
        };
        $proteinG = $weightKg * $proteinPerKg;

        $fatG = $weightKg * 0.9;

        $kcalFromProtein = $proteinG * 4;
        $kcalFromFat     = $fatG * 9;
        $kcalLeft        = max(0, $calTarget - $kcalFromProtein - $kcalFromFat);
        $carbsG          = $kcalLeft / 4;

        $proteinG = $this->round5($proteinG);
        $fatG     = $this->round5($fatG);
        $carbsG   = $this->round5($carbsG);

        $fiberG = round(($calTarget / 1000) * 14, 0);
        $waterL = round($weightKg * 0.035, 1);

        return [
            'bmr'            => round($bmr, 0),
            'tdee'           => round($tdee, 0),
            'calorie_target' => round($calTarget, 0),
            'protein_g'      => $proteinG,
            'fat_g'          => $fatG,
            'carbs_g'        => $carbsG,
            'fiber_g'        => (float)$fiberG,
            'water_l'        => (float)$waterL,
        ];
    }

    public function generateByAI(User $u, array $input): array
    {
        $apiKey = config('services.openai.key') ?? env('OPENAI_API_KEY');
        $model  = config('services.openai.model', 'gpt-4o-mini');
        if (!$apiKey) {
            throw new \RuntimeException('AI disabled: missing API key');
        }

        $payload = [
            'sex'            => strtolower((string)($u->sex ?? 'm')),
            'age'            => (int)($u->age ?? 25),
            'height_cm'      => (float)($u->height ?? 175),  
            'weight_kg'      => (float)($u->weight ?? 75),   
            'activity_level' => $input['activity_level'],
            'mode'           => $input['mode'],
            'experience'     => $input['experience'],
        ];

        $promptName = 'goal-generation-v1';

        $response = \Http::withToken($apiKey)
            ->timeout(30)
            ->retry(2, 500)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Sos un nutricionista deportivo. Responde estrictamente con JSON válido.'
                    ],
                    [
                        'role' => 'user',
                        'content' =>
                            "Generá objetivos diarios SOLO en JSON con este contrato:\n".
                            json_encode([
                                'bmr' => 'number',
                                'tdee' => 'number',
                                'calorie_target' => 'number',
                                'protein_g' => 'number',
                                'fat_g' => 'number',
                                'carbs_g' => 'number',
                                'fiber_g' => 'number',
                                'water_l' => 'number',
                            ])."\n\n".
                            "Reglas duras:\n".
                            "- BMR = Mifflin–St Jeor.\n".
                            "- TDEE = BMR * factor actividad (1.2,1.375,1.55,1.725,1.9).\n".
                            "- Calorías: maintenance=TDEE, gain=+10–15%, loss=−15–20%.\n".
                            "- Proteína g/kg: beginner 1.7, advanced 1.9, professional 2.1.\n".
                            "- Grasas: 0.9 g/kg.\n".
                            "- Carbs = calorías restantes / 4.\n".
                            "- Redondeá macros (protein/fat/carbs) a múltiplos de 5g.\n".
                            "- Devolvé números y SOLO JSON válido.\n\n".
                            "Datos: ".json_encode($payload),
                    ],
                ],
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.1,
            ])
            ->throw()
            ->json();

        $content = Arr::get($response, 'choices.0.message.content');
        if (!$content) {
            throw new \RuntimeException('AI empty response');
        }

        $data = json_decode($content, true);
        if (!is_array($data)) {
            throw new \RuntimeException('AI invalid JSON');
        }

        $validator = \Validator::make($data, [
            'bmr'            => 'required|numeric',
            'tdee'           => 'required|numeric',
            'calorie_target' => 'required|numeric',
            'protein_g'      => 'required|numeric',
            'fat_g'          => 'required|numeric',
            'carbs_g'        => 'required|numeric',
            'fiber_g'        => 'required|numeric',
            'water_l'        => 'required|numeric',
        ]);
        if ($validator->fails()) {
            throw new \RuntimeException('AI validation failed: '.$validator->errors()->first());
        }

        foreach ($data as $k => $v) {
            $data[$k] = is_numeric($v) ? (float)$v : $v;
        }

        return [
            'metrics' => $data,
            'raw'     => $data,       
            'model'   => $model,
            'prompt'  => $promptName,
        ];
    }

    public function upsertPlan(User $u, array $metrics, array $metaInput, string $source, ?array $aiContext = null): UserNutritionPlan
    {
        $last = $u->nutritionPlans()->latest('effective_from')->first();
        $version = $last ? ($last->version + 1) : 1;

        $plan = new UserNutritionPlan();
        $plan->fill(array_merge([
            'user_id'        => $u->id,
            'version'        => $version,
            'effective_from' => Carbon::today(),
            'generated_by'   => $source, // 'ai' | 'rule'
            'ai_model'       => $aiContext['model'] ?? null,
            'prompt_snapshot'=> $aiContext['prompt'] ?? null,
            'ai_raw_json'    => $aiContext['raw'] ?? null,
        ], [
            'mode'           => $metaInput['mode'],
            'experience'     => $metaInput['experience'],
            'activity_level' => $metaInput['activity_level'],
        ], $metrics));

        $plan->save();

        return $plan->fresh();
    }

    private function activityFactor(string $level): float
    {
        return match ($level) {
            'sedentary' => 1.2,
            'light'     => 1.375,
            'moderate'  => 1.55,
            'high'      => 1.725,
            'athlete'   => 1.9,
            default     => 1.55,
        };
    }

    private function bmrMifflinStJeor(string $sex, float $wKg, float $hCm, int $age): float
    {
        $base = 10*$wKg + 6.25*$hCm - 5*$age;
        return ($sex === 'f') ? ($base - 161) : ($base + 5);
    }

    private function round5(float $g): float
    {
        return (float)(5 * round($g / 5));
    }
}
