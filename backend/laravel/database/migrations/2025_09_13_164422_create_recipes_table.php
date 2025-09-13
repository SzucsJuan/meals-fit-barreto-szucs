<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecipesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recipes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->string('title', 180);
                $table->string('slug', 200)->unique()->nullable();
                $table->text('description')->nullable();
                $table->mediumText('steps')->nullable();
                $table->enum('visibility', ['public','unlisted','private'])->default('public');
                $table->decimal('servings', 8, 2)->default(1.00);
                $table->unsignedInteger('prep_time_minutes')->default(0);
                $table->unsignedInteger('cook_time_minutes')->default(0);
                $table->string('image_url')->nullable();
                $table->decimal('calories', 10, 2)->default(0);
                $table->decimal('protein', 10, 2)->default(0);
                $table->decimal('carbs', 10, 2)->default(0);
                $table->decimal('fat', 10, 2)->default(0);
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
        Schema::dropIfExists('recipes');
    }
}
