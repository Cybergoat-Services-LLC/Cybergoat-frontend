@extends('layouts.admin')
@push('title', get_phrase('Create Pricing Plan '))
@push('meta')@endpush
@push('css')@endpush
@section('content')
    <!-- Mani section header and breadcrumb -->
    <div class="ol-card radius-8px print-d-none">
        <div class="ol-card-body my-3 py-4 px-20px">
            <div class="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-md-nowrap">
                <h4 class="title fs-16px">
                    <i class="fi-rr-settings-sliders me-2"></i>
                    <span>{{ get_phrase('Create Pricing Plan') }}</span>
                </h4>
            </div>
        </div>
    </div>
    
    <div class="container m-5">


    <form action="{{ route('admin.pricing-plans.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        @include('admin.pricing_plans.form')

        <button type="submit" class="btn btn-primary mt-3">Create</button>
    </form>
</div>

@endsection