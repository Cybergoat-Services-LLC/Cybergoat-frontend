<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PricingPlanController extends Controller
{
    public function index()
    {
        $plans = PricingPlan::all();
        return view('admin.pricing_plans.index', compact('plans'));
    }

    public function create()
    {
        return view('admin.pricing_plans.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_type' => 'required|in:text,image',
            'title' => 'required_if:title_type,text',
            'title_image' => 'required_if:title_type,image|image|mimes:jpeg,png,jpg,gif|max:2048',
          
            'price' => 'required',
            'features_raw' => 'required|string',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|url|max:255',
            'sort_order' => 'required',
        ]);

          if ($request->title_type === 'image' && $request->hasFile('title_image')) {
            if ($request->title_type === 'image') {
              if ($request->hasFile('title_image')) {
    $image = $request->file('title_image');
    $imageName = time() . '_' . $image->getClientOriginalName();

    // Save to public/assets
    $image->move(public_path('assets/title'), $imageName);

    // Save only the filename or full path depending on your preference
    $title = 'assets/title/' . $imageName;  // This will be used in DB
}
            }

            
        } elseif ($request->title_type === 'text') {
            $title = $request->title;
        }

        $features = array_filter(array_map('trim', explode("\n", $request->features_raw)));

// Convert array to string (e.g., joined with `|` or `\n`)
$featuresString = implode('|', $features); // or "\n"

        PricingPlan::create([
            'title_type' => $request->title_type,
            'title' => $title,
            'sort_order' => $request->sort_order,
            'price' => $request->price,
            'features' => $featuresString,
            'button_text' => $request->button_text,
            'button_link' => $request->button_link,
        ]);

        return redirect()->route('admin.pricing-plans.index')->with('success', 'Plan created successfully.');
    }

    public function edit(PricingPlan $pricingPlan)
    {
        return view('admin.pricing_plans.edit', ['plan' => $pricingPlan]);
    }

    public function update(Request $request, PricingPlan $pricingPlan)
    {
        $request->validate([
            'title_type' => 'required|in:text,image',
            'title' => 'required_if:title_type,text',
            'title_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
       
            'price' => 'required',
            'features_raw' => 'required|string',
            'button_text' => 'nullable|string|max:255',
            'button_link' => 'nullable|url|max:255',
             'sort_order' => 'required',
        ]);

        $title = $pricingPlan->title;

        if ($request->title_type === 'image' && $request->hasFile('title_image')) {
            if ($request->title_type === 'image') {
              if ($request->hasFile('title_image')) {
    $image = $request->file('title_image');
    $imageName = time() . '_' . $image->getClientOriginalName();

    // Save to public/assets
    $image->move(public_path('assets/title'), $imageName);

    // Save only the filename or full path depending on your preference
    $title = 'assets/title/' . $imageName;  // This will be used in DB
}
            }

            
        } elseif ($request->title_type === 'text') {
            $title = $request->title;
        }

        $features = array_filter(array_map('trim', explode("\n", $request->features_raw)));

// Convert array to string (e.g., joined with `|` or `\n`)
$featuresString = implode('|', $features); // or "\n"

        $pricingPlan->update([
            'title_type' => $request->title_type,
            'title' => $title,
            'sort_order' => $request->sort_order,
            'price' => $request->price,
            'features' => $featuresString,
            'button_text' => $request->button_text,
            'button_link' => $request->button_link,
        ]);

        return redirect()->route('admin.pricing-plans.index')->with('success', 'Plan updated successfully.');
    }

    public function destroy(PricingPlan $pricingPlan)
    {
        if ($pricingPlan->title_type === 'image') {
            Storage::disk('public')->delete($pricingPlan->title);
        }

        $pricingPlan->delete();
        return redirect()->route('admin.pricing-plans.index')->with('success', 'Plan deleted successfully.');
    }
}
