<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE meal_details MODIFY logged_at TIMESTAMP NULL');
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE meal_details ALTER COLUMN logged_at DROP NOT NULL');
        }

        Schema::table('meal_details', function (Blueprint $table) {
            try {
                $table->dropForeign(['ingredient_id']);
            } catch (\Throwable $e) {}

            try {
                $table->dropForeign(['recipe_id']);
            } catch (\Throwable $e) {}

            $table->unsignedBigInteger('ingredient_id')->nullable()->change();
            $table->unsignedBigInteger('recipe_id')->nullable()->change();
            $table->decimal('servings', 8, 2)->nullable()->change();
            $table->decimal('grams', 8, 2)->nullable()->change();


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
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE meal_details MODIFY logged_at TIMESTAMP NOT NULL');
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE meal_details ALTER COLUMN logged_at SET NOT NULL');
        }

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

            $table->foreign('ingredient_id')
                ->references('id')->on('ingredients');

            $table->foreign('recipe_id')
                ->references('id')->on('recipes');
        });
    }
};