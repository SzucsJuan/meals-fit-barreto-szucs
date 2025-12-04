<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class RecipeImageController extends Controller
{
    private const CLOUDINARY_FOLDER = 'meals-fit-recipes';

    /**
     * Sube una imagen a Cloudinary y actualiza la receta con el Public ID.
     * Cloudinary manejará automáticamente las variantes (webp, thumbs) vía transformaciones en URL.
     */
    public function store(Request $request, Recipe $recipe)
    {
        // 1. Validación
        // - max:5120 => ~5 MB
        // - dimensions => evitamos imágenes minúsculas o absurdamente grandes
        $data = $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,gif,webp',
                'max:5120',
            ],
        ]);

        $uploadedFile = $data['image'];

        try {
            // 2. Subir a Cloudinary
            // Guardamos el original (Cloudinary se encarga de optimizar en delivery)
            $uploaded = Cloudinary::upload(
                $uploadedFile->getRealPath(),
                [
                    'folder'    => self::CLOUDINARY_FOLDER,
                    'public_id' => 'recipe-' . $recipe->id . '-' . time(),
                    'overwrite' => true,
                    'resource_type' => 'image',
                ]
            );

            // Importante: $uploadResult implementa ArrayAccess
            $publicId = $uploaded->getPublicId();
            $w        = $uploaded->getWidth();
            $h        = $uploaded->getHeight();

            } catch (\Exception $e) {
            Log::error('Cloudinary Upload Failed', [
                'recipe_id' => $recipe->id,
                'error'     => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Error al subir la imagen a Cloudinary.',
            ], 500);
        }

        // 3. Eliminar imagen anterior si existe (basada en public_id previo)
        if ($recipe->image_path) {
            $this->deletePreviousCloudinaryImage($recipe->image_path);
        }

        // 4. Actualizar la Receta en BD
        $recipe->fill([
            'image_disk'       => 'cloudinary',
            'image_path'       => $publicId, // Guardamos el public_id
            'image_thumb_path' => null,      // ya no se usan rutas físicas
            'image_webp_path'  => null,
            'image_width'      => $w,
            'image_height'     => $h,
        ])->save();

        // 5. Generar URLs con transformaciones para la respuesta
        $baseUrl = $this->generateBaseUrl($publicId);

        $thumbUrl = Cloudinary::cloudinaryApi()->url($publicId, [
            'width'        => 512,
            'crop'         => 'limit',
            'quality'      => 'auto:good',
            'fetch_format' => 'auto',
        ]);

        $webpUrl = Cloudinary::cloudinaryApi()->url($publicId, [
            'fetch_format' => 'webp',
            'quality'      => 'auto:good',
        ]);

        return response()->json([
            'image_url'       => $baseUrl,
            'image_thumb_url' => $thumbUrl,
            'image_webp_url'  => $webpUrl,
            'width'           => $w,
            'height'          => $h,
        ], 201);
    }

    /**
     * Elimina la imagen de Cloudinary y limpia la base de datos.
     */
    public function destroy(Recipe $recipe)
    {
        if ($recipe->image_path) {
            $this->deletePreviousCloudinaryImage($recipe->image_path);
        }

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
     * Helper para eliminar una imagen de Cloudinary.
     */
    protected function deletePreviousCloudinaryImage(string $publicId): void
    {
        try {
            Cloudinary::destroy($publicId, [
                'invalidate' => true, // opcional para invalidar caché CDN
            ]);
        } catch (\Exception $e) {
            Log::warning("Cloudinary deletion failed", [
                'public_id' => $publicId,
                'error'     => $e->getMessage(),
            ]);
        }
    }

    /**
     * Genera la URL base optimizada de la imagen.
     */
    protected function generateBaseUrl(string $publicId): string
    {
        // Versión "full" optimizada para uso principal (detalle de receta)
        return Cloudinary::cloudinaryApi()->url($publicId, [
            'quality'      => 'auto:good',
            'fetch_format' => 'auto',
        ]);
    }
}
