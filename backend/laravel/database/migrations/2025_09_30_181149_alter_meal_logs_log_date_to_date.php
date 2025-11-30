<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE meal_logs MODIFY log_date DATE NOT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE meal_logs ALTER COLUMN log_date TYPE DATE USING log_date::DATE');
            DB::statement('ALTER TABLE meal_logs ALTER COLUMN log_date SET NOT NULL');
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE meal_logs MODIFY log_date DATETIME NOT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE meal_logs ALTER COLUMN log_date TYPE TIMESTAMP USING log_date::TIMESTAMP');
            DB::statement('ALTER TABLE meal_logs ALTER COLUMN log_date SET NOT NULL');
        }
    }
};