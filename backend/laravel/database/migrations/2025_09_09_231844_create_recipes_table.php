<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('category', ['dulce','salado','otro'])->default('otro');
            $table->enum('status', ['pendiente','aprobada','rechazada'])->default('pendiente');

            
            $table->integer('prep_time')->nullable();
            $table->integer('cook_time')->nullable();
            $table->integer('servings')->default(1);

            $table->integer('calories')->default(0);
            $table->integer('proteins')->default(0);
            $table->integer('carbs')->default(0);
            $table->integer('fats')->default(0);
            $table->string('image')->nullable();

            $table->longText('instructions')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};

