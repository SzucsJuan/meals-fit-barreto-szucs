<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->string('image_disk', 50)->nullable()->after('cook_time_minutes');      // 'public', 's3', etc.
            $table->string('image_path', 512)->nullable()->after('image_disk');            // p.ej. 'recipes/123/uuid.jpg'
            $table->string('image_thumb_path', 512)->nullable()->after('image_path');      // p.ej. 'recipes/123/uuid_thumb.jpg'
            $table->string('image_webp_path', 512)->nullable()->after('image_thumb_path'); // p.ej. 'recipes/123/uuid.webp'
            $table->unsignedInteger('image_width')->nullable()->after('image_webp_path');  // ancho px
            $table->unsignedInteger('image_height')->nullable()->after('image_width');     // alto px

            $table->index(['image_disk']);
            $table->index(['image_path']);
        });
    }

    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            $table->dropIndex(['image_disk']);
            $table->dropIndex(['image_path']);

            $table->dropColumn([
                'image_disk',
                'image_path',
                'image_thumb_path',
                'image_webp_path',
                'image_width',
                'image_height',
            ]);
        });
    }
};
