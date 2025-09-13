<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


return new class extends Migration {
public function up(): void
{
DB::statement(<<<'SQL'
CREATE OR REPLACE VIEW vw_recipe_nutrition AS
SELECT
r.id AS recipe_id,
SUM((ri.quantity / CASE WHEN i.serving_unit = 'unit' THEN 1 ELSE i.serving_size END) * i.calories) / NULLIF(r.servings,0) AS calories_per_serving,
SUM((ri.quantity / CASE WHEN i.serving_unit = 'unit' THEN 1 ELSE i.serving_size END) * i.protein) / NULLIF(r.servings,0) AS protein_per_serving,
SUM((ri.quantity / CASE WHEN i.serving_unit = 'unit' THEN 1 ELSE i.serving_size END) * i.carbs) / NULLIF(r.servings,0) AS carbs_per_serving,
SUM((ri.quantity / CASE WHEN i.serving_unit = 'unit' THEN 1 ELSE i.serving_size END) * i.fat) / NULLIF(r.servings,0) AS fat_per_serving
FROM recipes r
JOIN recipe_ingredient ri ON ri.recipe_id = r.id
JOIN ingredients i ON i.id = ri.ingredient_id
GROUP BY r.id
SQL);


DB::statement(<<<'SQL'
CREATE OR REPLACE VIEW vw_daily_macros AS
SELECT
ml.user_id,
ml.log_date,
SUM(md.calories) AS calories,
SUM(md.protein) AS protein,
SUM(md.carbs) AS carbs,
SUM(md.fat) AS fat
FROM meal_logs ml
JOIN meal_details md ON md.meal_log_id = ml.id
GROUP BY ml.user_id, ml.log_date
SQL);
}


public function down(): void
{
DB::statement('DROP VIEW IF EXISTS vw_daily_macros');
DB::statement('DROP VIEW IF EXISTS vw_recipe_nutrition');
}
};