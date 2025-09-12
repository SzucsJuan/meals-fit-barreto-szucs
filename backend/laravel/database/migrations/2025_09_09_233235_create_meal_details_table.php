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
            $table->foreignId('meal_log_id')->constrained('meal_logs')->onDelete('cascade');
            $table->string('meal_type'); 
            $table->string('food_name');
            $table->decimal('calories', 8, 2);
            $table->decimal('protein', 8, 2);
            $table->decimal('carbohydrates', 8, 2);
            $table->decimal('fats', 8, 2);
            $table->timestamps();
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
