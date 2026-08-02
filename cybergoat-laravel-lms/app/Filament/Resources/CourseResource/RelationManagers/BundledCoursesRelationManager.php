<?php

namespace App\Filament\Resources\CourseResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class BundledCoursesRelationManager extends RelationManager
{
    protected static string $relationship = 'bundledCourses';

    protected static ?string $title = 'Bundled Free Courses';

    /**
     * This bundles EXISTING courses together (pick from your catalog) - it
     * never creates a new course record, so there's no form here, only
     * attach/detach against the pivot table.
     */
    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->inverseRelationship('bundledInCourses')
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('slug')->searchable(),
                Tables\Columns\TextColumn::make('price')->money('AED'),
            ])
            ->headerActions([
                Tables\Actions\AttachAction::make()
                    ->preloadRecordSelect()
                    ->recordSelectOptionsQuery(fn ($query) => $query->where('courses.id', '!=', $this->getOwnerRecord()->id)),
            ])
            ->actions([
                Tables\Actions\DetachAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DetachBulkAction::make(),
                ]),
            ]);
    }
}
