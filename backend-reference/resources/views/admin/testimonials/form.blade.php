@extends('layouts.admin')
@push('title', get_phrase(' Testimonial '))
@push('meta')@endpush
@push('css')@endpush
@section('content')
    <!-- Mani section header and breadcrumb -->
    <div class="ol-card radius-8px print-d-none">
        <div class="ol-card-body my-3 py-4 px-20px">
            <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-md-nowrap">
                <h4 class="title fs-16px">
                    <i class="fi-rr-settings-sliders me-2"></i>
                    <span>{{ isset($testimonial) ? 'Edit' : 'Add' }} Testimonial</span>
                </h4>
            </div>
        </div>
    </div>
    <div class="container m-5">
    

    <form method="POST" action="{{ isset($testimonial) ? route('admin.testimonials.update', $testimonial) : route('admin.testimonials.store') }}" enctype="multipart/form-data">
        @csrf
        @if(isset($testimonial))
            @method('PUT')
        @endif

        <div class="mb-3">
            <label>Name</label>
            <input name="name" class="form-control" value="{{ old('name', $testimonial->name ?? '') }}" required>
        </div>

        <div class="mb-3">
            <label>Designation</label>
            <input name="designation" class="form-control" value="{{ old('designation', $testimonial->designation ?? '') }}" required>
        </div>

        <div class="mb-3">
            <label>Description</label>
            <textarea name="description" class="form-control" rows="4" required>{{ old('description', $testimonial->description ?? '') }}</textarea>
        </div>

        <div class="mb-3">
            <label>Image</label>
            <input type="file" name="image" class="form-control">
            @if(isset($testimonial) && $testimonial->image)
                <img src="{{ asset($testimonial->image) }}" height="80" class="mt-2">
            @endif
        </div>

        <button class="btn btn-success">{{ isset($testimonial) ? 'Update' : 'Create' }}</button>
    </form>
</div>

    
  @endsection