<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // ⚠️ Cambia la columna a DATE sin tocar datos
        DB::statement("ALTER TABLE meal_logs MODIFY log_date DATE NOT NULL");
    }

    public function down(): void
    {
        // ⚠️ Revertir a DATETIME si es necesario
        DB::statement("ALTER TABLE meal_logs MODIFY log_date DATETIME NOT NULL");
    }
};
