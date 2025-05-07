<?php

namespace App\Policies;

use App\Models\Page;
use App\Models\User;

class PagePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Page $page): bool
    {
        return true;
    }
}
