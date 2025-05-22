<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Page;

class PageRevision extends Model
{
    protected $fillable = ['page_id', 'content', 'user_id'];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
