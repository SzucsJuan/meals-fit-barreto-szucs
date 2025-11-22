<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin1234'),
            'role' => 'admin',
            'profile_picture' => 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            'age' => 28,
            'weight' => 70,
            'height' => 1.80
        ]);

        User::create([
            'name' => 'user',
            'email' => 'user@prueba.com',
            'password' => Hash::make('prueba1234'),
            'role' => 'user',
            'profile_picture' => 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            'age' => 28,
            'weight' => 70,
            'height' => 1.80
        ]);
    }
}
