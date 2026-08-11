export type CourseItem = {
  title: string;
  description: string;
  image: string;
  tag: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
  includesVoucher?: boolean;
  category?: 'EC-Council';
};

// CyberGOAT-authored tracks (no EC-Council courseware behind them) intentionally
// removed from the public catalog - see KHDA alignment review, August 2026.
export const TRAINING_PROGRAMS: CourseItem[] = [];

export const CERTIFICATIONS: CourseItem[] = [
  {
    title: 'CEH v13 AI',
    description: 'Certified Ethical Hacker v13 AI — Official EC-Council Certification & Hands-On iLabs.',
    image: '/cg-assets/certifications/CEH.jpeg',
    tag: 'EC-Council',
    duration: '45 Hours',
    level: 'Intermediate',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'C|CISO',
    description: 'Certified Chief Information Security Officer — Official EC-Council Executive Leadership Track.',
    image: '/cg-assets/certifications/CCISO.png',
    tag: 'EC-Council',
    duration: '40 Hours',
    level: 'Executive',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'CHFI v11',
    description: 'Computer Hacking Forensic Investigator — Official EC-Council Digital Forensics Program.',
    image: '/cg-assets/certifications/CHFI.png',
    tag: 'EC-Council',
    duration: '40 Hours',
    level: 'Advanced',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'CND v2',
    description: 'Certified Network Defender — Official EC-Council Network Defense & Perimeter Protection Program.',
    image: '/cg-assets/certifications/CEH.jpeg',
    tag: 'EC-Council',
    duration: '40 Hours',
    level: 'Intermediate',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'CPENT / LPT',
    description: 'Certified Penetration Testing Professional & Licensed Pen Tester — Advanced EC-Council Exploitation.',
    image: '/cg-assets/certifications/CEH.jpeg',
    tag: 'EC-Council',
    duration: '45 Hours',
    level: 'Advanced',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'CSA (SOC Analyst)',
    description: 'Certified SOC Analyst — Official EC-Council Security Operations & SIEM Monitoring Track.',
    image: '/cg-assets/certifications/CEH.jpeg',
    tag: 'EC-Council',
    duration: '35 Hours',
    level: 'Intermediate',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'CTIA',
    description: 'Certified Threat Intelligence Analyst — Official EC-Council Threat Intelligence & Cyber Recon Program.',
    image: '/cg-assets/certifications/CHFI.png',
    tag: 'EC-Council',
    duration: '35 Hours',
    level: 'Advanced',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'CCSE',
    description: 'Certified Cloud Security Engineer — Official EC-Council AWS, Azure & GCP Cloud Defense Program.',
    image: '/cg-assets/certifications/CCISO.png',
    tag: 'EC-Council',
    duration: '40 Hours',
    level: 'Advanced',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'ECIH v2',
    description: 'EC-Council Certified Incident Handler — Official Incident Handling & Response Program.',
    image: '/cg-assets/certifications/CHFI.png',
    tag: 'EC-Council',
    duration: '35 Hours',
    level: 'Intermediate',
    includesVoucher: true,
    category: 'EC-Council',
  },
  {
    title: 'Ethical Hacking Essentials (EHE)',
    description: 'Official EC-Council entry-level ethical hacking and cybersecurity fundamentals program.',
    image: '/cg-assets/learnings/EthicalHackingFundamentals.jpeg',
    tag: 'EC-Council',
    duration: '20 Hours',
    level: 'Beginner',
    includesVoucher: true,
    category: 'EC-Council',
  },
];
