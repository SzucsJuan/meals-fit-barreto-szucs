<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMealLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meal_logs', function (Blueprint $table) {
            $table->integer('total_calories')->default(0);
            $table->integer('total_protein')->default(0);
            $table->integer('total_carbohydrates')->default(0);
            $table->integer('total_fats')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('meal_logs');
    }
}
