<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            if (Schema::hasColumn('recipes', 'image_url')) {
                $table->dropColumn('image_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->string('image_url')->nullable();
        });
    }
};
