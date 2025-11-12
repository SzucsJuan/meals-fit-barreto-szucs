<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('recipes')
            ->where('visibility', 'unlisted')
            ->update(['visibility' => 'private']);

        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            // MySQL / MariaDB
            DB::statement(
                "ALTER TABLE `recipes`
                 MODIFY `visibility` ENUM('public','private') NOT NULL DEFAULT 'public'"
            );
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_visibility_check");
            DB::statement("ALTER TABLE recipes ALTER COLUMN visibility TYPE TEXT");
            DB::statement(
                "ALTER TABLE recipes
                 ADD CONSTRAINT recipes_visibility_check
                 CHECK (visibility IN ('public','private'))"
            );
        } elseif ($driver === 'sqlite') {
            try {
                Schema::table('recipes', function (Blueprint $table) {
                    $table->string('visibility')->default('public')->nullable(false)->change();
                });
            } catch (\Throwable $e) {
            }
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement(
                "ALTER TABLE `recipes`
                 MODIFY `visibility` ENUM('public','unlisted','private') NOT NULL DEFAULT 'public'"
            );
        } elseif ($driver === 'pgsql') {
            DB::statement("ALTER TABLE recipes DROP CONSTRAINT IF EXISTS recipes_visibility_check");
            DB::statement(
                "ALTER TABLE recipes
                 ADD CONSTRAINT recipes_visibility_check
                 CHECK (visibility IN ('public','unlisted','private'))"
            );
        } elseif ($driver === 'sqlite') {
        }
    }
};
