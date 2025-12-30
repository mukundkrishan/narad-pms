<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'version',
        'is_core',
        'is_active',
    ];

    protected $casts = [
        'is_core' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function corporates()
    {
        return $this->belongsToMany(Corporate::class, 'corporate_modules')->withPivot('is_enabled');
    }
}