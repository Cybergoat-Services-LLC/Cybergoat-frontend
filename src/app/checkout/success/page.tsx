import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { getPortalToken } from '@/app/lib/portalAuth';
import LogoutButton from '@/app/dashboard/LogoutButton';
import PaymentStatusPoller from './PaymentStatusPoller';

export const metadata = {
  title: 'Payment Successful | CyberGOAT Services LLC',
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const token = await getPortalToken();
  if (!token) redirect('/login');

  const { invoice } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans flex flex-col">
      <nav className="w-full py-6 border-b border-white/5">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <Image src="/CG White logo_.PNG" alt="CyberGOAT" width={220} height={70} priority className="h-12 w-auto object-contain logo-bright-blue" />
          </Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        {invoice ? (
          <PaymentStatusPoller invoiceNumber={invoice} />
        ) : (
          <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
            <ExclamationTriangleIcon className="w-10 h-10 text-amber-400 mx-auto" />
            <h1 className="text-lg font-bold text-white">Missing invoice reference</h1>
            <p className="text-sm text-gray-400">
              We couldn&apos;t tell which order this was for. Check your dashboard to confirm your enrollment.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
