<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMealDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meal_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_log_id')->constrained('meal_logs')->cascadeOnDelete();
            $table->enum('meal_type', ['breakfast','lunch','dinner','snack'])->default('snack');
            $table->foreignId('ingredient_id')->nullable()->constrained('ingredients')->restrictOnDelete();
            $table->foreignId('recipe_id')->nullable()->constrained('recipes')->restrictOnDelete();
            $table->decimal('servings', 10, 3)->default(1.000);
            $table->decimal('grams', 10, 2)->nullable();
            $table->decimal('calories', 12, 2)->default(0);
            $table->decimal('protein', 12, 2)->default(0);
            $table->decimal('carbs', 12, 2)->default(0);
            $table->decimal('fat', 12, 2)->default(0);
            $table->dateTime('logged_at')->useCurrent();
            $table->timestamps();
            $table->check('NOT (ingredient_id IS NULL AND recipe_id IS NULL)');
            $table->check('NOT (ingredient_id IS NOT NULL AND recipe_id IS NOT NULL)');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('meal_details');
    }
}
