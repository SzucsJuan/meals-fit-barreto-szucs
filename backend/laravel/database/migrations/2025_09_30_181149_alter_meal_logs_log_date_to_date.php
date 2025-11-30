<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE meal_logs MODIFY log_date DATE NOT NULL");
        }
        if($driver === 'pgsql') {
            DB::statement("ALTER TABLE meal_logs ALTER COLUMN log_date TYPE DATE USING log_date::DATE");
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE meal_logs MODIFY log_date DATETIME NOT NULL");
        }
        if($driver === 'pgsql') {
            DB::statement("ALTER TABLE meal_logs ALTER COLUMN log_date TYPE TIMESTAMP USING log_date::TIMESTAMP");
        }
    }
};