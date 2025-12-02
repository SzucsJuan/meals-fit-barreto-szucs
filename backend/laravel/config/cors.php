<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'user', 'register'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://mealsandfit.netlify.app',
        'https://mealsandfit.com',
        'http://localhost:3000',
        'https://mealsandfit.onrender.com',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['XSRF-TOKEN'],
    'max_age' => 0,
    'supports_credentials' => true,  // ← CLAVE

];
