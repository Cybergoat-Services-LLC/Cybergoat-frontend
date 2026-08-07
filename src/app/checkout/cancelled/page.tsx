import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';
import LogoutButton from '@/app/dashboard/LogoutButton';

export const metadata = {
  title: 'Checkout Cancelled | CyberGOAT Services LLC',
};

async function getCourseSlug(invoiceNumber: string, token: string): Promise<string | null> {
  try {
    const res = await callPortalApi(`/v1/invoices/${invoiceNumber}`, { token });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.course?.slug ?? null;
  } catch {
    return null;
  }
}

export default async function CheckoutCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const token = await getPortalToken();
  if (!token) redirect('/login');

  const { invoice } = await searchParams;
  const slug = invoice ? await getCourseSlug(invoice, token) : null;

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
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
          <XCircleIcon className="w-10 h-10 text-gray-500 mx-auto" />
          <h1 className="text-lg font-bold text-white">Checkout cancelled</h1>
          <p className="text-sm text-gray-400">No charge was made to your card.</p>
          <Link
            href={slug ? `/dashboard/checkout/${slug}` : '/dashboard/courses'}
            className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
          >
            {slug ? 'Try Again' : 'Browse Courses'}
          </Link>
        </div>
      </div>
    </main>
  );
}
