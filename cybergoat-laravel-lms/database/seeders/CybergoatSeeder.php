<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

class CybergoatSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'slug' => 'ceh-v12',
                'title' => 'Certified Ethical Hacker v12',
                'certification_code' => 'CEH v12',
                'vendor' => 'EC-Council',
                'hours' => 40,
                'level' => 'Intermediate',
                'description' => 'Master hands-on ethical hacking, penetration testing, and real-world attack vectors with official EC-Council iLabs.',
                'is_official_voucher_included' => true,
            ],
            [
                'slug' => 'chfi-v11',
                'title' => 'Computer Hacking Forensic Investigator v11',
                'certification_code' => 'CHFI v11',
                'vendor' => 'EC-Council',
                'hours' => 40,
                'level' => 'Advanced',
                'description' => 'Enterprise digital forensics, evidence acquisition, cybercrime investigation, and chain of custody procedures.',
                'is_official_voucher_included' => true,
            ],
            [
                'slug' => 'cciso',
                'title' => 'Certified Chief Information Security Officer',
                'certification_code' => 'C|CISO',
                'vendor' => 'EC-Council',
                'hours' => 40,
                'level' => 'Executive',
                'description' => 'Executive-level security governance, risk management, strategic planning, and board-level cybersecurity leadership.',
                'is_official_voucher_included' => true,
            ],
            [
                'slug' => 'cisa',
                'title' => 'Certified Information Systems Auditor',
                'certification_code' => 'CISA',
                'vendor' => 'ISACA',
                'hours' => 40,
                'level' => 'Advanced',
                'description' => 'Globally recognized standard for IS audit, control, assurance, and security assessment professionals.',
                'is_official_voucher_included' => false,
            ],
            [
                'slug' => 'cism',
                'title' => 'Certified Information Security Manager',
                'certification_code' => 'CISM',
                'vendor' => 'ISACA',
                'hours' => 40,
                'level' => 'Advanced',
                'description' => 'Management-focused certification validating expertise in information security governance and program development.',
                'is_official_voucher_included' => false,
            ],
            [
                'slug' => 'cissp',
                'title' => 'Certified Information Systems Security Professional',
                'certification_code' => 'CISSP',
                'vendor' => 'ISC2',
                'hours' => 40,
                'level' => 'Executive',
                'description' => 'The gold standard in information security for senior security practitioners, managers, and executives.',
                'is_official_voucher_included' => false,
            ],
        ];

        foreach ($courses as $course) {
            Course::updateOrCreate(
                ['slug' => $course['slug']],
                $course
            );
        }
    }
}
