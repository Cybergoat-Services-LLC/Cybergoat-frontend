import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeftIcon, BuildingLibraryIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';
import LogoutButton from '@/app/dashboard/LogoutButton';
import CheckoutPanel from './CheckoutPanel';

export const metadata = {
  title: 'Checkout | CyberGOAT Services LLC',
};

interface Course {
  slug: string;
  title: string;
  vendor: string | null;
  certification_code: string | null;
  price: string;
  currency: string;
}

type CourseResult =
  | { status: 'ok'; course: Course }
  | { status: 'not_found' }
  | { status: 'error' };

async function getCourse(slug: string): Promise<CourseResult> {
  // Public endpoint - no token needed for the lookup - but the page itself
  // still gates on the student being logged in.
  const res = await callPortalApi(`/v1/courses/${slug}`);
  if (res.status === 404) return { status: 'not_found' };
  if (!res.ok) return { status: 'error' };

  const data = await res.json();
  if (!data?.data) return { status: 'not_found' };

  const c = data.data;
  return {
    status: 'ok',
    course: {
      slug: c.slug ?? slug,
      title: c.title ?? slug,
      vendor: c.vendor ?? null,
      certification_code: c.certification_code ?? null,
      price: String(c.price ?? '0.00'),
      currency: c.currency ?? 'AED',
    },
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await getPortalToken();
  if (!token) redirect('/login');

  const result = await getCourse(slug);
  if (result.status === 'not_found') notFound();

  if (result.status === 'error') {
    return (
      <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans flex items-center justify-center px-6">
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
          <ExclamationTriangleIcon className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="text-lg font-bold text-white">We couldn&apos;t load checkout</h1>
          <p className="text-sm text-gray-400">
            Your session is fine — the backend just didn&apos;t respond. Please try again in a moment.
          </p>
          <Link
            href={`/dashboard/checkout/${slug}`}
            className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
          >
            Retry
          </Link>
        </div>
      </main>
    );
  }

  const { course } = result;
  const price = parseFloat(course.price);

  if (price <= 0) {
    // Free courses don't go through checkout at all - send the student back
    // to the catalog where "Enroll Free" lives instead.
    redirect('/dashboard/courses');
  }

  return (
    <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans">
      <nav className="w-full py-6 border-b border-white/5">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <Image src="/CG White logo_.PNG" alt="CyberGOAT" width={220} height={70} priority className="h-12 w-auto object-contain logo-bright-blue" />
          </Link>
          <LogoutButton />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-2xl space-y-8">
        <div>
          <Link href="/dashboard/courses" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition mb-3">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Courses
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Checkout</h1>
          <p className="text-sm text-gray-400 mt-1">Review your order and choose how you&apos;d like to pay.</p>
        </div>

        {/* Course summary */}
        <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 space-y-2">
          <h2 className="font-bold text-white text-lg">{course.title}</h2>
          {course.vendor && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <BuildingLibraryIcon className="w-3.5 h-3.5 shrink-0" />
              {course.vendor}
              {course.certification_code ? ` · ${course.certification_code}` : ''}
            </p>
          )}
        </div>

        <CheckoutPanel slug={course.slug} price={price} currency={course.currency} />
      </div>
    </main>
  );
}
