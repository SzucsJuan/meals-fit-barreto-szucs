<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class RecipeImageController extends Controller
{
    
    /**
     * Sube una imagen a Cloudinary y actualiza la receta con el Public ID.
     * Cloudinary manejará automáticamente la optimización, WebP, y las miniaturas a través de transformaciones en URL.
     */
    public function store(Request $request, Recipe $recipe)
    {
        // 1. Validación (se mantiene)
        $data = $request->validate([
            // La extensión 'webp' se permite aunque Cloudinary la genera,
            // pero mantenemos la validación de archivos de imagen comunes.
            'image' => ['required','image','mimes:jpeg,png,gif','max:5120'],
        ]);

        $uploadedFile = $data['image'];
        
        try {
            // 2. Subir a Cloudinary
            // El método upload devuelve un array con todos los detalles
            $uploadResult = Cloudinary::upload($uploadedFile->getRealPath(), [
                'folder' => 'meals-fit-recipes', // Carpeta en Cloudinary
                'public_id' => 'recipe-' . $recipe->id . '-' . time(), // Generar un ID predecible
                'overwrite' => true, // Reemplazar si el ID ya existe (en caso de re-subida)
            ]);

        } catch (\Exception $e) {
            Log::error('Cloudinary Upload Failed: ' . $e->getMessage());
            return response()->json(['message' => 'Error al subir la imagen a Cloudinary.'], 500);
        }
        
        // 3. Obtener datos de Cloudinary
        // Accedemos a las propiedades usando notación de array para mayor compatibilidad
        $publicId = $uploadResult['public_id'];
        $w = $uploadResult['width'];
        $h = $uploadResult['height'];
        
        // 4. Eliminar imagen anterior si existe
        if ($recipe->image_path) {
            // En el código original, image_path contenía la ruta local.
            // Asumimos que ahora image_path contendrá el Public ID de Cloudinary.
            $this->deletePreviousCloudinaryImage($recipe->image_path);
        }

        // 5. Actualizar la Receta
        // Simplificamos los campos, ya que la miniatura y WebP son transformaciones.
        // Usamos 'image_path' para guardar el Public ID (la referencia única).
        $recipe->fill([
            'image_disk'       => 'cloudinary', // Marcador para saber el driver
            'image_path'       => $publicId, // Guardamos el Public ID
            'image_thumb_path' => null, // Ya no se necesita almacenar path de miniatura
            'image_webp_path'  => null, // Ya no se necesita almacenar path de webp
            'image_width'      => $w,
            'image_height'     => $h,
        ])->save();
        
        // 6. Generar URLs con Transformaciones para la respuesta
        $baseUrl = $this->generateBaseUrl($publicId);

        return response()->json([
            // URL principal (optimizada por defecto por Cloudinary)
            'image_url'       => $baseUrl,
            
            // URL de miniatura (transformación Cloudinary: w_512, c_limit, q_auto, f_auto)
            'image_thumb_url' => Cloudinary::cloudinaryApi()->url($publicId, [
                'width' => 512, 
                'crop' => 'limit', 
                'quality' => 'auto',
                'fetch_format' => 'auto'
            ]),
            
            // URL WebP (transformación Cloudinary: f_webp)
            'image_webp_url'  => Cloudinary::cloudinaryApi()->url($publicId, [
                'fetch_format' => 'webp', 
                'quality' => 'auto'
            ]),
            
            'width'           => $w,
            'height'          => $h,
        ], 201);
    }

    /**
     * Elimina la imagen de Cloudinary y limpia la base de datos.
     */
    public function destroy(Recipe $recipe)
    {
        // 1. Eliminar la imagen de Cloudinary
        if ($recipe->image_path) {
            // Asumimos que image_path contiene el Public ID
            $this->deletePreviousCloudinaryImage($recipe->image_path);
        }

        // 2. Limpiar la base de datos
        $recipe->update([
            'image_disk'       => null,
            'image_path'       => null,
            'image_thumb_path' => null,
            'image_webp_path'  => null,
            'image_width'      => null,
            'image_height'     => null,
        ]);

        return response()->noContent();
    }
    
    /**
     * Función helper para eliminar una imagen de Cloudinary.
     */
    protected function deletePreviousCloudinaryImage(string $publicId): void
    {
        try {
            Cloudinary::destroy($publicId);
        } catch (\Exception $e) {
            // Registrar el error pero no detener la ejecución si falla la eliminación
            Log::warning("Cloudinary deletion failed for ID {$publicId}: " . $e->getMessage());
        }
    }
    
    /**
     * Función helper para generar la URL base de la imagen.
     */
    protected function generateBaseUrl(string $publicId): string
    {
        // Genera la URL para la imagen original, con optimización automática.
        return Cloudinary::cloudinaryApi()->url($publicId, [
            'quality' => 'auto',
            'fetch_format' => 'auto'
        ]);
    }
}