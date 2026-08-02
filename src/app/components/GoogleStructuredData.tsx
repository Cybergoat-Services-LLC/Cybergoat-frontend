export default function GoogleStructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': 'https://www.cybergoat.ae/#organization',
    name: 'CyberGOAT Services LLC',
    alternateName: 'CyberGOAT',
    url: 'https://www.cybergoat.ae',
    logo: 'https://www.cybergoat.ae/CG%20White%20logo_.PNG',
    image: 'https://www.cybergoat.ae/cg-assets/grc_cyber_shield.png',
    description:
      'Premier EC-Council Authorized Reseller & Training Partner in Dubai Silicon Oasis. Official training and exam readiness for CEH, CHFI, C|CISO, CISA, CISM, CISSP, and Privacy laws.',
    telephone: '+971551846786',
    email: 'admin@cybergoat.ae',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dubai Silicon Oasis',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.1212',
      longitude: '55.3773',
    },
    sameAs: [
      'https://www.linkedin.com/company/cybergoat-services-llc/',
      'https://x.com/cybergoat_uae',
      'https://www.facebook.com/profile.php?id=61573085285172',
      'https://wa.me/971551846786',
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Course',
          name: 'CEH v12 - Certified Ethical Hacker',
          description: 'Official EC-Council Ethical Hacking certification training with official exam vouchers and hands-on iLabs.',
          provider: {
            '@type': 'Organization',
            name: 'CyberGOAT Services LLC',
            sameAs: 'https://www.cybergoat.ae',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Course',
          name: 'CHFI v11 - Computer Hacking Forensic Investigator',
          description: 'Official EC-Council Digital Forensics certification training with exam vouchers and evidence acquisition labs.',
          provider: {
            '@type': 'Organization',
            name: 'CyberGOAT Services LLC',
            sameAs: 'https://www.cybergoat.ae',
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Course',
          name: 'C|CISO - Certified Chief Information Security Officer',
          description: 'Executive CISO security governance leadership track with official EC-Council vouchers.',
          provider: {
            '@type': 'Organization',
            name: 'CyberGOAT Services LLC',
            sameAs: 'https://www.cybergoat.ae',
          },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />
    </>
  );
}
