@extends('layouts.admin')
@push('title', get_phrase(' Update Home Banner '))
@push('meta')@endpush
@push('css')@endpush
@section('content')
    <!-- Mani section header and breadcrumb -->
    <div class="ol-card radius-8px print-d-none">
        <div class="ol-card-body my-3 py-4 px-20px">
            <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-md-nowrap">
                <h4 class="title fs-16px">
                    <i class="fi-rr-settings-sliders me-2"></i>
                    <span>Update Home Banner</span>
                </h4>
            </div>
        </div>
    </div>
  <div class="container m-5">
    

  

    <form method="POST" action="{{ route('admin.home_banner.update') }}" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label>Title</label>
            
             <textarea name="title" class="form-control" rows="4" required>{{ old('title', $banner->title ?? '') }}</textarea>
        </div>

        <div class="mb-3">
            <label>Description</label>
            <textarea name="description" class="form-control" rows="4" required>{{ old('description', $banner->description ?? '') }}</textarea>
        </div>

        <div class="mb-3">
            <label>Image</label>
            <input type="file" name="image" class="form-control">
            @if(isset($banner->image))
                <img src="{{ asset($banner->image) }}" height="100" class="mt-2">
            @endif
        </div>

        <button class="btn btn-success">Update</button>
    </form>
</div>
@endsection