import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import SubmissionStatus from './SubmissionStatus';

export const metadata = {
  title: 'Documents Received | DESC ISR Readiness Score | CyberGOAT',
  description: 'Your security policy documents have been received and are being reviewed for your DESC ISR readiness score.',
};

export default async function DescIsrSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; id?: string }>;
}) {
  const { email, id } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans flex flex-col selection:bg-[#0DCAF0]/30 selection:text-white">
      <nav className="w-full py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
          </Link>
          <Image
            src="/CG White logo_.PNG"
            alt="CyberGOAT"
            width={220}
            height={70}
            priority
            className="h-12 w-auto object-contain logo-bright-blue"
          />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#05080F] border border-white/10 glass-card space-y-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Thanks &mdash; your documents are being analyzed
              </h1>
              <p className="text-gray-400 leading-relaxed">
                Our AI is running your preliminary DESC ISR readiness assessment now.
                {email ? (
                  <>
                    {' '}
                    A CyberGOAT security expert will review the findings before sending your report to{' '}
                    <span className="text-white font-semibold">{email}</span>.
                  </>
                ) : (
                  <> A CyberGOAT security expert will review the AI-generated findings before your report is sent to the email you provided.</>
                )}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-left pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-[#0DCAF0] font-bold text-sm">
                  <UserGroupIcon className="w-4 h-4" /> Human Reviewed
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every AI-generated finding is checked by a certified CyberGOAT security professional before it
                  reaches you.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-[#0DCAF0] font-bold text-sm">
                  <ClockIcon className="w-4 h-4" /> 1&ndash;2 Business Days
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Because a real person reviews every report, delivery isn&rsquo;t instant &mdash; expect your score
                  by email within 1&ndash;2 business days.
                </p>
              </div>
            </div>

            {id && /^\d+$/.test(id) && (
              <div className="text-left">
                <SubmissionStatus submissionId={id} />
              </div>
            )}

            <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-500">
              <EnvelopeIcon className="w-3.5 h-3.5" />
              <span>Check your inbox (and spam folder) for an email from CyberGOAT.</span>
            </div>

            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(47,87,239,0.4)] transition-all cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
