<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
    'title_type', 'title', 'plan_name', 'price', 'features',
    'button_text', 'button_link','sort_order'
];

   
}
