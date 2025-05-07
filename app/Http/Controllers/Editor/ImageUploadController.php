<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function storeByFile(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('image')->store('images', 'public');

        $url = Storage::url($path);

        return response()->json([
            'success' => 1,
            'file' => [
                'url' => $url,
            ],
        ]);
    }

    public function storeByUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $imageUrl = $request->input('url');
        $imageContents = Http::get($imageUrl)->body();
        $extension = pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION);
        $imageName = Str::random(40).'.'.$extension;
        $path = 'images/'.$imageName;

        Storage::disk('public')->put($path, $imageContents);

        $url = Storage::url($path);

        return response()->json([
            'success' => 1,
            'file' => [
                'url' => $url,
            ],
        ]);
    }
}
