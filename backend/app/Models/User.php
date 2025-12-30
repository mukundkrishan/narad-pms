<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'mobile',
        'address',
        'password',
        'corporate_id',
        'role',
        'role_id',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'corporate_id' => $this->corporate_id,
            'role' => $this->role,
            'role_id' => $this->role_id,
        ];
    }

    // Role constants
    const ROLE_SUPER_ADMIN = 1;
    const ROLE_ADMIN = 2;
    const ROLE_USER = 3;

    public function isAdmin()
    {
        return $this->role_id == self::ROLE_ADMIN;
    }

    public function corporate()
    {
        return $this->belongsTo(Corporate::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function settings()
    {
        return $this->hasMany(Setting::class);
    }
}