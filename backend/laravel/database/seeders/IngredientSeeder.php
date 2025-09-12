<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run()
    {
        $ingredients = [
            'proteins' => [
                'Pollo', 'Pechuga de pollo', 'Muslo de pollo', 'Carne vacuna magra', 'Carne molida',
                'Pescado blanco', 'Salmón', 'Atún', 'Merluza', 'Langostinos',
                'Huevos', 'Claras de huevo', 'Tofu','Lentejas', 'Garbanzos', 
                'Porotos negros', 'Porotos rojos', 'Arvejas',
            ],
            'dairy' => [
                'Leche', 'Leche descremada', 'Leche de almendras', 'Leche de soja',
                'Yogur natural', 'Yogur griego', 'Queso fresco', 'Queso mozzarella', 'Queso parmesano',
            ],
            'vegetables' => [
                'Lechuga', 'Espinaca', 'Acelga', 'Rúcula', 'Repollo', 'Coliflor',
                'Brócoli', 'Zanahoria', 'Zapallo', 'Calabacín', 'Pimiento rojo',
                'Pimiento verde', 'Pimiento amarillo', 'Berenjena', 'Tomate', 'Cebolla',
                'Ajo', 'Papa', 'Batata', 'Pepino', 'Remolacha', 'Choclo',
            ],
            'fruits' => [
                'Manzana', 'Banana', 'Pera', 'Naranja', 'Mandarina', 'Pomelo',
                'Kiwi', 'Mango', 'Durazno', 'Ananá', 'Melón', 'Sandía',
                'Uvas', 'Frutillas', 'Cerezas', 'Arándanos', 'Ciruelas',
            ],
            'cereals' => [
                'Arroz blanco', 'Arroz integral', 'Quinoa', 'Cuscús','Avena',
                'Harina de trigo', 'Harina integral', 'Pan integral',
                'Fideos de trigo', 'Fideos de arroz', 'Tortilla de maíz',
            ],
            'nuts' => [
                'Almendras', 'Nueces', 'Avellanas', 'Castañas de cajú',
                'Semillas de chía', 'Semillas de lino', 'Semillas de sésamo',
                'Semillas de girasol', 'Maní', 'Pistachos',
            ],
            'oils' => [
                'Aceite de oliva', 'Aceite de girasol', 'Aceite de coco',
                'Manteca', 'Palta',
            ],
            'spices' => [
                'Sal', 'Pimienta negra', 'Pimienta blanca', 'Comino', 'Cúrcuma',
                'Curry', 'Pimentón', 'Orégano', 'Albahaca', 'Perejil',
                'Romero', 'Tomillo', 'Laurel', 'Canela', 'Nuez moscada',
                'Clavo de olor', 'Jengibre fresco', 'Jengibre en polvo',
                'Salsa de soja', 'Vinagre', 'Mostaza', 'Miel',
            ],
        ];

        foreach ($ingredients as $category => $items) {
            foreach ($items as $ingredient) {
                $unit = $this->getUnit($category);

                Ingredient::create([
                    'name' => $ingredient,
                    'quantity' => $unit,
                ]);
            }
        }
    }

    private function getUnit($category)
    {
        switch ($category) {
            case 'proteins':
            case 'vegetables':
            case 'fruits':
            case 'cereals':
            case 'nuts':
                return 'g';

            case 'dairy':
            case 'oils':
                return 'ml';

            case 'spices':
                return 'cdta';

            default:
                return 'g';
        }
    }
}
