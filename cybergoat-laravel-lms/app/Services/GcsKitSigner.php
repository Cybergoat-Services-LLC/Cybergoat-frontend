<?php

namespace App\Services;

use Google\Cloud\Storage\StorageClient;

class GcsKitSigner
{
    /**
     * Generate a real V4 signed URL for a private object in the course-kits bucket.
     */
    public function sign(string $objectPath, \DateTimeInterface $expiresAt): string
    {
        $storage = new StorageClient([
            'projectId' => config('filesystems.gcs.project_id'),
            'keyFilePath' => config('filesystems.gcs.key_file'),
        ]);

        return $storage->bucket(config('filesystems.gcs.bucket'))
            ->object($objectPath)
            ->signedUrl($expiresAt, ['version' => 'v4']);
    }
}
