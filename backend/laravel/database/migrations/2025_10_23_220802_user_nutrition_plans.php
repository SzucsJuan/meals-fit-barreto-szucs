<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UserNutritionPlans extends Migration
{
    public function up()
    {
        Schema::create('user_nutrition_plans', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->enum('mode', ['maintenance','gain','loss']);
            $t->enum('experience', ['beginner','advanced','professional']);
            $t->enum('activity_level', ['sedentary','light','moderate','high','athlete'])->default('moderate');
            $t->float('bmr');
            $t->float('tdee');
            $t->float('calorie_target');
            $t->float('protein_g');
            $t->float('fat_g');
            $t->float('carbs_g');
            $t->float('fiber_g')->nullable();
            $t->float('water_l')->nullable();
            $t->enum('generated_by', ['rule','ai'])->default('rule');
            $t->string('ai_model')->nullable();
            $t->longText('prompt_snapshot')->nullable();
            $t->json('ai_raw_json')->nullable();
            $t->unsignedInteger('version')->default(1);
            $t->date('effective_from')->useCurrent();
            $t->text('notes')->nullable();
            $t->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_nutrition_plans');
    }
}
