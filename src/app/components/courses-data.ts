export type CourseItem = {
  title: string;
  description: string;
  image: string;
  tag: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
  includesVoucher?: boolean;
  category?: 'EC-Council';
  regulatoryBadge?: string;
  targetRole?: string;
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 9 • Technical Vulnerability Assessment',
    targetRole: 'Penetration Tester / Security Specialist',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 1 • ISO/IEC 27001 Clause 7.2 • UAE PDPL Art. 10',
    targetRole: 'Chief Information Security Officer / DPO',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 11 • Digital Forensics & Chain of Custody',
    targetRole: 'Digital Forensics Analyst',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 9 • Perimeter Defense & Traffic Controls',
    targetRole: 'Network Security Engineer',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 9 • Advanced Red Team Operations',
    targetRole: 'Senior Penetration Tester',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 9 • UAE IA v1.1 M3 (SOC Competence)',
    targetRole: 'SOC Analyst / SIEM Operations',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 11 • Cyber Threat Intelligence',
    targetRole: 'Threat Intelligence Analyst',
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
    regulatoryBadge: 'Sovereign Cloud Security • ISO/IEC 27017 Cloud Controls',
    targetRole: 'Cloud Security Architect',
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
    regulatoryBadge: 'DESC ISR v3.1 Domain 11 • UAE PDPL Article 9 (Breach Response)',
    targetRole: 'Incident Response Specialist',
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
    regulatoryBadge: 'Entry-Level Fundamentals (Academy Practitioner Track)',
    targetRole: 'Cybersecurity Junior / Entry-Level',
  },
];
