<?php

namespace App\Models;

use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Illuminate\Support\Facades\Auth;

use App\Models\PageRevision;


class Page extends Model
{
    use Searchable, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'title',
        'content',
        'restricted',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function revisions()
    {
        return $this->hasMany(PageRevision::class);
    }
    protected static function booted()
    {
        static::updating(function (Page $page) {
            if ($page->isDirty('content')) {
                $page->revisions()->create([
                    'content' => $page->content,
                    'user_id' => Auth::id(),
                ]);
            }
        });
    }

    // Sluggs, search
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'title',
            ],
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
        ];
    }
}
