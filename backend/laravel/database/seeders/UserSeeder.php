<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name'      => 'Admin',
            'email'     => 'admin@admin.com',
            'password'  => Hash::make('admin123'),
            'role'      => 'admin',
        ]);

        User::create([
            'name'      => 'Juan',
            'email'     => 'juan@user.com',
            'password'  => Hash::make('juan123'),
            'role'      => 'user',
        ]);

        User::create([
            'name'      => 'Ian',
            'email'     => 'ian@user.com',
            'password'  => Hash::make('ian123'),
            'role'      => 'user',
        ]);
    }
}
