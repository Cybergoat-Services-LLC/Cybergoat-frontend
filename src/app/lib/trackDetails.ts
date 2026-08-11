export type TrackDetail = {
  stage: string;
  title: string;
  subtitle: string;
  duration: string;
  level: string;
  includesVoucher: boolean;
  isOfficialPartner: boolean;
  certHeader: string;
  readinessTitle: string;
  readinessDesc: string;
  certs: string[];
  modules: string[];
  careerPaths: string[];
  color: string;
};

export const TRACK_DETAILS: Record<string, TrackDetail> = {
  'Stage 1': {
    stage: 'Stage 1',
    title: 'Technical Defense Track',
    subtitle: 'Master hands-on penetration testing, digital forensics, and vulnerability exploitation.',
    duration: '80 Hours (8 Weeks)',
    level: 'Intermediate / Advanced',
    includesVoucher: true,
    isOfficialPartner: true,
    certHeader: 'Included EC-Council Certifications',
    readinessTitle: '🎓 Authorized Partner & Official Vouchers Included',
    readinessDesc: 'Includes official EC-Council courseware, direct official exam vouchers (CEH v13 AI, CHFI v11), hands-on iLabs, and certified instructor coaching.',
    certs: ['EC-Council CEH v13 AI (Voucher Included)', 'EC-Council CHFI v11 (Voucher Included)'],
    modules: [
      'Module 1: Reconnaissance, Scanning & Footprinting',
      'Module 2: System Exploitation, Privilege Escalation & Pivoting',
      'Module 3: Web Application & Wireless Penetration Testing',
      'Module 4: Computer Hacking Forensic Investigation (CHFI Methodology)',
      'Module 5: Memory Analysis & Digital Evidence Collection',
      'Module 6: Official EC-Council iLabs & Live Range Exercises'
    ],
    careerPaths: ['Penetration Tester', 'Ethical Hacker', 'SOC Analyst L2/L3', 'Incident Responder'],
    color: 'from-[#0DCAF0] to-[#2F57EF]'
  },
  'Stage 2': {
    stage: 'Stage 2',
    title: 'Executive CISO Track',
    subtitle: 'Command executive security governance, enterprise architecture, and board-level leadership.',
    duration: '50 Hours (5 Weeks)',
    level: 'Executive',
    includesVoucher: true,
    isOfficialPartner: true,
    certHeader: 'Included Certifications',
    readinessTitle: '🎓 Authorized C|CISO Executive Partner',
    readinessDesc: 'Includes official EC-Council C|CISO courseware, official exam voucher, executive case studies, and C-suite mentorship.',
    certs: ['EC-Council C|CISO (Official Voucher Included)'],
    modules: [
      'Module 1: Governance & Risk Management Domain (C|CISO Domain 1)',
      'Module 2: Information Security Controls, Compliance & Audit',
      'Module 3: Security Program Management & Strategic Planning',
      'Module 4: Information Security Core Competencies & Financial Management',
      'Module 5: Enterprise Architecture (SABSA / TOGAF Integration)',
      'Module 6: Executive Board Communications & C-Suite Risk Strategy'
    ],
    careerPaths: ['Chief Information Security Officer (CISO)', 'VP of Cybersecurity', 'Head of Security Governance'],
    color: 'from-[#C664FF] to-pink-500'
  }
};
