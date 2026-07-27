@extends('layouts.admin')
@push('title', get_phrase(' Pricing Plan '))
@push('meta')@endpush
@push('css')@endpush
@section('content')
    <!-- Mani section header and breadcrumb -->
    <div class="ol-card radius-8px print-d-none">
        <div class="ol-card-body my-3 py-4 px-20px">
            <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-md-nowrap">
                <h4 class="title fs-16px">
                    <i class="fi-rr-settings-sliders me-2"></i>
                    <span>{{ get_phrase(' Pricing Plan') }}</span>
                </h4>
            </div>
        </div>
    </div>
  

<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
       
        <a href="{{ route('admin.pricing-plans.create') }}" class="btn btn-primary">+ Add New Plan</a>
    </div>

    <!--@if (session('success'))-->
    <!--    <div class="alert alert-success">{{ session('success') }}</div>-->
    <!--@endif-->

    <div class="table-responsive">
        <table class="table table-bordered align-middle">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Title</th>
                   
                    <th>Price</th>
                    <th>Features</th>
                    <th>Button</th>
                    <th>Sort Order</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($plans as $index => $plan)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>
                            @if ($plan->title_type === 'image')
                                <img src="{{ asset($plan->title) }}" alt="Title Image" height="40">
                            @else
                                {{ $plan->title }}
                            @endif
                        </td>
                      
                        <td>{{ $plan->price }}</td>
                        <td>
                            <ul class="mb-0 ps-3">
                                @foreach (explode('|', $plan->features) as $feature)
                                    <li>{{ $feature }}</li>
                                @endforeach
                            </ul>
                        </td>
                        <td>
                            @if ($plan->button_link)
                                <a href="{{ $plan->button_link }}" class="btn btn-sm btn-outline-primary" target="_blank">
                                    {{ $plan->button_text ?? 'Click' }}
                                </a>
                            @endif
                        </td>
                        <td>{{ $plan->sort_order }}</td>
                        <td>
                            <a href="{{ route('admin.pricing-plans.edit', $plan->id) }}" class="btn btn-sm btn-warning">Edit</a>
                            <form action="{{ route('admin.pricing-plans.destroy', $plan->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Delete this plan?');">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-sm btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="text-center">No pricing plans found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection