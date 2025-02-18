<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',       // Allow the title attribute to be mass-assigned
        'description', // Allow the description attribute to be mass-assigned
        'completed',   // Allow the completed attribute to be mass-assigned (if needed)
    ];
}
