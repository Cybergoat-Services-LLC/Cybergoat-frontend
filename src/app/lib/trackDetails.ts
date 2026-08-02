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
    title: 'Fundamentals Track',
    subtitle: 'Build essential security, privacy, and ethical hacking foundations.',
    duration: '40 Hours (4 Weeks)',
    level: 'Beginner',
    includesVoucher: false,
    isOfficialPartner: false,
    certHeader: 'Core Learning Modules',
    readinessTitle: '🎓 Comprehensive Foundation Training',
    readinessDesc: 'Includes instructor mentorship, practical lab exercises, course completion certificate, and foundational assessment.',
    certs: ['Cybersecurity Fundamentals', 'Ethical Hacking Intro', 'Privacy Basics'],
    modules: [
      'Module 1: Cyber Threat Landscape & Attack Vectors',
      'Module 2: Network Security & Encryption Principles',
      'Module 3: Identity & Access Management (IAM)',
      'Module 4: OWASP Top 10 Web Application Vulnerabilities',
      'Module 5: Fundamental Data Privacy Laws & Frameworks',
      'Module 6: Hands-On Security Lab Environments'
    ],
    careerPaths: ['Junior Security Analyst', 'IT Administrator', 'Compliance Coordinator', 'AppSec Trainee'],
    color: 'from-emerald-500 to-teal-500'
  },
  'Stage 2': {
    stage: 'Stage 2',
    title: 'Technical Defense Track',
    subtitle: 'Master hands-on penetration testing, digital forensics, and vulnerability exploitation.',
    duration: '80 Hours (8 Weeks)',
    level: 'Intermediate / Advanced',
    includesVoucher: true,
    isOfficialPartner: true,
    certHeader: 'Included EC-Council Certifications',
    readinessTitle: '🎓 Authorized Partner & Official Vouchers Included',
    readinessDesc: 'Includes official EC-Council courseware, direct official exam vouchers (CEH v12, CHFI v11), hands-on iLabs, and certified instructor coaching.',
    certs: ['EC-Council CEH v12 (Voucher Included)', 'EC-Council CHFI v11 (Voucher Included)', 'VAPT Advanced Practical Labs', 'AppSec Specialist'],
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
  'Stage 3': {
    stage: 'Stage 3',
    title: 'GRC & Audit Track',
    subtitle: 'Lead enterprise risk governance, IT auditing, data privacy, and regulatory compliance.',
    duration: '60 Hours (6 Weeks)',
    level: 'Advanced',
    includesVoucher: false,
    isOfficialPartner: false,
    certHeader: 'Certification Exam Preparation Targets',
    readinessTitle: '🎓 Intensive Exam Readiness Training',
    readinessDesc: 'CyberGOAT provides comprehensive bootcamp training, domain reviews, and practice questions to make you 100% ready for ISACA (CISA/CISM/CRISC), ISC2 (CISSP), and IAPP (CIPP/E) exams.',
    certs: ['CISA (ISACA) — Exam Readiness', 'CISM (ISACA) — Exam Readiness', 'CRISC (ISACA) — Exam Readiness', 'CISSP (ISC2) — Exam Readiness', 'CIPP/E (Data Privacy) — Exam Readiness'],
    modules: [
      'Module 1: Information Systems Auditing & Internal Controls',
      'Module 2: Enterprise Risk Management (ERM) & ISO 27001 Alignment',
      'Module 3: Global Regulatory Frameworks (EU GDPR, DESC ISR, UAE PDPL, DORA)',
      'Module 4: Business Continuity & Disaster Recovery Planning (BCP/DRP)',
      'Module 5: Security Architecture & Vendor Risk Management',
      'Module 6: Audit Preparation & Board Risk Reporting'
    ],
    careerPaths: ['IT Auditor', 'GRC Manager', 'Data Protection Officer (DPO)', 'Risk & Compliance Director'],
    color: 'from-[#2F57EF] to-[#C664FF]'
  },
  'Stage 4': {
    stage: 'Stage 4',
    title: 'Executive CISO Track',
    subtitle: 'Command executive security governance, enterprise architecture, and board-level leadership.',
    duration: '50 Hours (5 Weeks)',
    level: 'Executive',
    includesVoucher: true,
    isOfficialPartner: true,
    certHeader: 'Included Certifications & Training Targets',
    readinessTitle: '🎓 Authorized C|CISO Executive Partner',
    readinessDesc: 'Includes official EC-Council C|CISO courseware, official exam voucher, TOGAF 10 Enterprise Architecture alignment training, executive case studies, and C-suite mentorship.',
    certs: ['EC-Council C|CISO (Official Voucher Included)', 'Applied Enterprise Security Architecture (ESA)', 'TOGAF 10 Enterprise Architecture — Framework Alignment'],
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
