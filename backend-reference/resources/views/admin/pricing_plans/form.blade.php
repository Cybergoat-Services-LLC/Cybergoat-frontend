@php
    $plan = $plan ?? null;
    $isEdit = isset($plan);
@endphp

{{-- Show validation errors --}}
@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="mb-3">
    <label for="title_type" class="form-label">Title Type</label>
    <select name="title_type" id="title_type" class="form-select" required>
        <option value="text" {{ old('title_type', $plan->title_type ?? '') === 'text' ? 'selected' : '' }}>Text</option>
        <option value="image" {{ old('title_type', $plan->title_type ?? '') === 'image' ? 'selected' : '' }}>Image</option>
    </select>
</div>

<div class="mb-3" id="titleTextWrapper">
    <label for="title" class="form-label">Title (Text)</label>
    <input type="text" name="title" id="title" class="form-control"
           value="{{ old('title', $plan && $plan->title_type === 'text' ? $plan->title : '') }}">
</div>

<div class="mb-3" id="titleImageWrapper" style="display: none;">
    <label for="title_image" class="form-label">Title (Image)</label>
    <input type="file" name="title_image" class="form-control" accept="image/*">

    @if($isEdit && $plan->title_type === 'image')
        <div class="mt-2">
            <img src="{{ asset($plan->title) }}" alt="Title Image" height="60">
        </div>
    @endif
</div>

<!--<div class="mb-3">-->
<!--    <label for="plan_name" class="form-label">Plan Name</label>-->
<!--    <input type="text" name="plan_name" class="form-control" value="{{ old('plan_name', $plan->plan_name ?? '') }}" required>-->
<!--</div>-->

<div class="mb-3">
    <label for="price" class="form-label">Price</label>
    <input type="text"  name="price" class="form-control" value="{{ old('price', $plan->price ?? '') }}" required>
</div>

<div class="mb-3">
    <label for="features_raw" class="form-label">Features (one per line)</label>
    <textarea name="features_raw" class="form-control" rows="5">
    {{ old('features_raw', isset($plan) ? implode("\n", explode('|', $plan->features)) : '') }}
</textarea>

</div>

<div class="mb-3">
    <label for="button_text" class="form-label">Button Text</label>
    <input type="text" name="button_text" class="form-control" value="{{ old('button_text', $plan->button_text ?? '') }}">
</div>

<div class="mb-3">
    <label for="button_link" class="form-label">Button Link</label>
    <input type="url" name="button_link" class="form-control" value="{{ old('button_link', $plan->button_link ?? '') }}">
</div>
<div class="mb-3">
    <label for="button_text" class="form-label">Showing Order</label>
    <input type="number" name="sort_order" class="form-control" value="{{ old('sort_order', $plan->sort_order ?? '') }}">
</div>

{{-- Toggle fields based on title_type --}}
@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const titleType = document.getElementById('title_type');
        const titleTextWrapper = document.getElementById('titleTextWrapper');
        const titleImageWrapper = document.getElementById('titleImageWrapper');

        function toggleTitleFields() {
            if (titleType.value === 'text') {
                titleTextWrapper.style.display = 'block';
                titleImageWrapper.style.display = 'none';
            } else {
                titleTextWrapper.style.display = 'none';
                titleImageWrapper.style.display = 'block';
            }
        }

        titleType.addEventListener('change', toggleTitleFields);
        toggleTitleFields(); // call once on load
    });
</script>

@endpush
