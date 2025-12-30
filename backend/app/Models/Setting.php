<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'key',
        'value',
        'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getValueAttribute($value)
    {
        switch ($this->type) {
            case 'json':
                return json_decode($value, true);
            case 'boolean':
                return (bool) $value;
            case 'number':
                return is_numeric($value) ? (float) $value : $value;
            default:
                return $value;
        }
    }

    public function setValueAttribute($value)
    {
        switch ($this->type) {
            case 'json':
                $this->attributes['value'] = json_encode($value);
                break;
            case 'boolean':
                $this->attributes['value'] = $value ? '1' : '0';
                break;
            default:
                $this->attributes['value'] = $value;
        }
    }
}