<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('meal_details', function (Blueprint $table) {
            try {
                $table->dropForeign(['ingredient_id']);
            } catch (\Throwable $e) {
            }

            try {
                $table->dropForeign(['recipe_id']);
            } catch (\Throwable $e) {
            }

            $table->unsignedBigInteger('ingredient_id')->nullable()->change();
            $table->unsignedBigInteger('recipe_id')->nullable()->change();
            $table->decimal('servings', 8, 2)->nullable()->change();
            $table->decimal('grams', 8, 2)->nullable()->change();
            $table->timestamp('logged_at')->nullable()->change();

            $table->foreign('ingredient_id')
                ->references('id')->on('ingredients')
                ->nullOnDelete();

            $table->foreign('recipe_id')
                ->references('id')->on('recipes')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('meal_details', function (Blueprint $table) {
            try {
                $table->dropForeign(['ingredient_id']);
            } catch (\Throwable $e) {}

            try {
                $table->dropForeign(['recipe_id']);
            } catch (\Throwable $e) {}

            $table->unsignedBigInteger('ingredient_id')->nullable(false)->change();
            $table->unsignedBigInteger('recipe_id')->nullable(false)->change();
            $table->decimal('servings', 8, 2)->nullable(false)->change();
            $table->decimal('grams', 8, 2)->nullable(false)->change();
            $table->timestamp('logged_at')->nullable(false)->change();

            $table->foreign('ingredient_id')
                ->references('id')->on('ingredients');

            $table->foreign('recipe_id')
                ->references('id')->on('recipes');
        });
    }
};