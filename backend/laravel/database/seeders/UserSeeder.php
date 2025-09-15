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
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'profile_picture' => 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            'age' => 28,
            'weight' => 70,
            'height' => 1.80
        ]);

        User::create([
            'name' => 'Juan',
            'email' => 'juan@user.com',
            'password' => Hash::make('juan123'),
            'role' => 'user',
            'profile_picture' => 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            'age' => 28,
            'weight' => 70,
            'height' => 1.80
        ]);

        User::create([
            'name' => 'Ian',
            'email' => 'ian@user.com',
            'password' => Hash::make('ian123'),
            'role' => 'user',
            'profile_picture' => 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            'age' => 26,
            'weight' => 70,
            'height' => 1.80
        ]);
    }
}
