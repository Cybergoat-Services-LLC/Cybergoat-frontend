<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeBanner;
use Illuminate\Http\Request;

class HomeBannerController extends Controller
{
    public function edit()
    {
        $banner = HomeBanner::first(); // assuming single row
        return view('admin.home_banner.edit', compact('banner'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'image' => 'nullable|image',
        ]);

        $banner = HomeBanner::first();

        $data = $request->only(['title', 'description']);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('assets/home_banners'), $filename);
            $data['image'] = 'assets/home_banners/' . $filename;
        }

        if ($banner) {
            $banner->update($data);
        } else {
            HomeBanner::create($data);
        }

        return back()->with('success', 'Banner updated successfully!');
    }
}
