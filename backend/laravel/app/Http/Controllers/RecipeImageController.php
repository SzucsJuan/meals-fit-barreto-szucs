<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image; // v2

class RecipeImageController extends Controller
{
    public function store(Request $request, Recipe $recipe)
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $disk = 'public';
        $uuid = (string) Str::uuid();
        $file = $data['image'];

        // Valores por defecto
        $mainPath = null;
        $thumbPath = null;
        $webpPath = null;
        $width = null;
        $height = null;

        try {
            // Intentamos usar Intervention de manera “segura”
            $ext = strtolower($file->extension() ?: 'jpg');

            // Puede fallar si falta gd/exif
            $img = Image::make($file->getRealPath());

            // orientate puede fallar si no hay exif, lo metemos en try aparte
            try {
                $img->orientate();
            } catch (\Throwable $e) {
                Log::warning('Recipe image orientate failed', [
                    'recipe_id' => $recipe->id,
                    'error'     => $e->getMessage(),
                ]);
            }

            $width  = $img->width();
            $height = $img->height();

            // ===== Imagen principal =====
            $mainPath = "recipes/{$recipe->id}/{$uuid}.{$ext}";
            $formatForMain = in_array($ext, ['png', 'webp']) ? $ext : 'jpg';

            $mainEncoded = (clone $img)->encode($formatForMain, 82);
            Storage::disk($disk)->put($mainPath, (string) $mainEncoded);

            // ===== Thumbnail =====
            $thumbImg = (clone $img)->resize(512, null, function ($c) {
                $c->aspectRatio();
                $c->upsize();
            });

            $thumbExt  = $formatForMain === 'png' ? 'png' : 'jpg';
            $thumbPath = "recipes/{$recipe->id}/{$uuid}_thumb.{$thumbExt}";

            $thumbEncoded = $thumbImg->encode($thumbExt, 82);
            Storage::disk($disk)->put($thumbPath, (string) $thumbEncoded);

            // ===== WEBP (OPCIONAL, puede fallar en Render) =====
            try {
                $webpPath = "recipes/{$recipe->id}/{$uuid}.webp";
                $webpEncoded = (clone $img)->encode('webp', 80);
                Storage::disk($disk)->put($webpPath, (string) $webpEncoded);
            } catch (\Throwable $e) {
                // Si falla webp no queremos romper toda la subida
                Log::warning('Recipe image webp encode failed', [
                    'recipe_id' => $recipe->id,
                    'error'     => $e->getMessage(),
                ]);
                $webpPath = null;
            }
        } catch (\Throwable $e) {
            // Fallback ultra simple: guardar el archivo original “crudo”
            Log::error('Recipe image processing failed, falling back to raw file', [
                'recipe_id' => $recipe->id,
                'error'     => $e->getMessage(),
            ]);

            $ext = strtolower($file->extension() ?: 'jpg');
            $mainPath = "recipes/{$recipe->id}/{$uuid}.{$ext}";

            // Esto NO usa Intervention, solo guarda el archivo tal cual
            Storage::disk($disk)->putFileAs(
                "recipes/{$recipe->id}",
                $file,
                "{$uuid}.{$ext}"
            );

            // No tenemos dimensiones ni thumb/webp en fallback
            $thumbPath = null;
            $webpPath  = null;
            $width     = null;
            $height    = null;
        }

        // Borrar imágenes anteriores si existían
        if ($recipe->image_disk) {
            foreach (['image_path', 'image_thumb_path', 'image_webp_path'] as $col) {
                $p = $recipe->{$col};
                if ($p && Storage::disk($recipe->image_disk)->exists($p)) {
                    Storage::disk($recipe->image_disk)->delete($p);
                }
            }
        }

        // Actualizar campos en la receta
        $recipe->fill([
            'image_disk'       => $disk,
            'image_path'       => $mainPath,
            'image_thumb_path' => $thumbPath,
            'image_webp_path'  => $webpPath,
            'image_width'      => $width,
            'image_height'     => $height,
        ])->save();

        return response()->json([
            'image_url'       => $mainPath ? Storage::disk($disk)->url($mainPath) : null,
            'image_thumb_url' => $thumbPath ? Storage::disk($disk)->url($thumbPath) : null,
            'image_webp_url'  => $webpPath ? Storage::disk($disk)->url($webpPath) : null,
            'width'           => $width,
            'height'          => $height,
        ], 201);
    }

    public function destroy(Recipe $recipe)
    {
        if ($recipe->image_disk) {
            foreach (['image_path', 'image_thumb_path', 'image_webp_path'] as $col) {
                $p = $recipe->{$col};
                if ($p && Storage::disk($recipe->image_disk)->exists($p)) {
                    Storage::disk($recipe->image_disk)->delete($p);
                }
            }
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
}