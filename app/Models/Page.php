<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Page extends Model
{
    protected $fillable = [
        'title',
        'content',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    // Automatically generate a slug from the title before creating
    protected static function booted()
    {
        static::creating(function ($page) {
            if (!$page->slug) {
                $slug = Str::slug($page->title);
                $existingPage = self::where('slug', $slug)->first();

                if ($existingPage) {
                    $slug = $slug . '-' . Str::random(6); // Append a random string if the slug already exists
                }

                $page->slug = $slug;
            }
        });
    }

}
