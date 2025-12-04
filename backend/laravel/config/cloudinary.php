<?php

return [


    'cloud_name' => env('dwiflctuf'),
    'api_key'    => env('913614982295124'),
    'api_secret' => env('xl8j7lIgdFeRrYFcR3-rdDybceE'),

    'url'        => env('cloudinary://913614982295124:xl8j7lIgdFeRrYFcR3-rdDybceE@dwiflctuf'),


    'secure'     => true,

    'timeout' => [
        'connect' => 30,
        'read'    => 30,
    ],

    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET', null),
];
