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
                    <span>{{ get_phrase(' Testimonial') }}</span>
                </h4>
            </div>
        </div>
    </div>
    <div class="container m-5">
   
    <a href="{{ route('admin.testimonials.create') }}" class="btn btn-primary mb-3">Add Testimonial</a>

    @foreach ($testimonials as $testimonial)
        <div class="card mb-3">
            <div class="card-body d-flex">
                @if ($testimonial->image)
                    <img src="{{ asset($testimonial->image) }}" class="me-3" height="80">
                @endif
                <div>
                    <h5>{{ $testimonial->name }} <small class="text-muted">({{ $testimonial->designation }})</small></h5>
                    <p>{{ $testimonial->description }}</p>
                    <a href="{{ route('admin.testimonials.edit', $testimonial) }}" class="btn btn-sm btn-warning">Edit</a>
                    <form action="{{ route('admin.testimonials.destroy', $testimonial) }}" method="POST" class="d-inline">
                        @csrf @method('DELETE')
                        <button onclick="return confirm('Delete this testimonial?')" class="btn btn-sm btn-danger">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    @endforeach
</div>
    
    
  @endsection