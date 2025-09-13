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
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('log_date');
            $table->decimal('total_calories', 12, 2)->default(0);
            $table->decimal('total_protein', 12, 2)->default(0);
            $table->decimal('total_carbs', 12, 2)->default(0);
            $table->decimal('total_fat', 12, 2)->default(0);
            $table->string('notes')->nullable();
            $table->timestamps();
            $table->unique(['user_id','log_date']);
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
