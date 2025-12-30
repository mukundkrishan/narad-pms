<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Corporate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'address',
        'logo',
        'organization_code',
        'user_allowed',
        'valid_from',
        'valid_to',
        'status',
        'last_payment_date',
        'last_payment_amount',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'valid_from' => 'date',
        'valid_to' => 'date',
        'last_payment_date' => 'date',
        'last_payment_amount' => 'decimal:2',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'corporate_modules')->withPivot('is_enabled');
    }
}