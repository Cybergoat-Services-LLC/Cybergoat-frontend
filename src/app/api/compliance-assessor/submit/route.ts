import { NextResponse } from 'next/server';

/**
 * POST /api/compliance-assessor/submit: DECOMMISSIONED (Data Sovereignty Policy)
 *
 * In accordance with UAE PDPL and GCC Data Residency requirements,
 * standalone policy document uploads to US-central1 have been discontinued.
 *
 * All compliance evaluations, policy mappings, and evidence auditing now occur
 * within the Sovereign CyberGOAT Continuous GRC Platform at https://app.cybergoat.ae.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        'The standalone compliance assessor tool has been decommissioned to enforce GCC data sovereignty. Corporate policies must not be transmitted to foreign hosting regions. Please explore our sovereign GRC platform at https://app.cybergoat.ae or book a tailored CISO walkthrough.',
      redirectUrl: '/#interactive-demo',
    },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'decommissioned',
      reason: 'Sovereign GCC GRC migration',
      platformUrl: 'https://app.cybergoat.ae',
    },
    { status: 410 }
  );
}
