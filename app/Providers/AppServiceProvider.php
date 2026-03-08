<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Paginator::useTailwind();

        // En producción forzar HTTPS; en local usar lo que venga en APP_URL
        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }
    }
}
