<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image; // v2


class RecipeImageController extends Controller
{
    
    public function store(Request $request, Recipe $recipe)
    {
        $data = $request->validate([
            'image' => ['required','image','mimes:jpeg,png,webp','max:5120'],
        ]);

        $disk = 'public';
        $uuid = (string) Str::uuid();

        $file = $data['image'];
        $ext  = strtolower($file->extension() ?: 'jpg');

        $img = Image::make($file->getRealPath())->orientate();

        $main = "recipes/{$recipe->id}/{$uuid}.{$ext}";
        $mainEncoded = (clone $img)->encode($ext === 'png' ? 'png' : ($ext === 'webp' ? 'webp' : 'jpg'), 82);
        Storage::disk($disk)->put($main, (string) $mainEncoded);

        $thumb = (clone $img)->resize(512, null, function ($c) {
            $c->aspectRatio();
            $c->upsize();
        });
        $thumbExt = $ext === 'png' ? 'png' : 'jpg';
        $thumbPath = "recipes/{$recipe->id}/{$uuid}_thumb.{$thumbExt}";
        Storage::disk($disk)->put($thumbPath, (string) $thumb->encode($thumbExt, 82));

        $webpPath = "recipes/{$recipe->id}/{$uuid}.webp";
        $webpEncoded = (clone $img)->encode('webp', 80);
        Storage::disk($disk)->put($webpPath, (string) $webpEncoded);

        $w = $img->width();
        $h = $img->height();

        if ($recipe->image_disk) {
            foreach (['image_path','image_thumb_path','image_webp_path'] as $col) {
                $p = $recipe->{$col};
                if ($p && Storage::disk($recipe->image_disk)->exists($p)) {
                    Storage::disk($recipe->image_disk)->delete($p);
                }
            }
        }

        $recipe->fill([
            'image_disk'       => $disk,
            'image_path'       => $main,
            'image_thumb_path' => $thumbPath,
            'image_webp_path'  => $webpPath,
            'image_width'      => $w,
            'image_height'     => $h,
        ])->save();

        return response()->json([
            'image_url'       => Storage::disk($disk)->url($main),
            'image_thumb_url' => Storage::disk($disk)->url($thumbPath),
            'image_webp_url'  => Storage::disk($disk)->url($webpPath),
            'width'           => $w,
            'height'          => $h,
        ], 201);
    }

    public function destroy(Recipe $recipe)
    {
        if ($recipe->image_disk) {
            foreach (['image_path','image_thumb_path','image_webp_path'] as $col) {
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
