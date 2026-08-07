import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowLeftIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  ClockIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';
import LogoutButton from '@/app/dashboard/LogoutButton';
import EnrollFreeButton from './EnrollFreeButton';

export const metadata = {
  title: 'Browse Courses | CyberGOAT Services LLC',
};

interface Course {
  id: number;
  slug: string;
  title: string;
  certification_code: string | null;
  vendor: string | null;
  hours: number | null;
  level: string | null;
  description: string | null;
  is_official_voucher_included: boolean;
  price: string;
  currency: string;
}

type CoursesResult =
  | { status: 'ok'; courses: Course[] }
  | { status: 'error' };

async function getCourses(): Promise<CoursesResult> {
  // Public endpoint - no token forwarded - but the page itself still gates
  // on the student being logged in, same as every other dashboard page.
  const res = await callPortalApi('/v1/courses');
  if (!res.ok) return { status: 'error' };

  const data = await res.json();
  return { status: 'ok', courses: (data?.data as Course[]) ?? [] };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatPrice(price: string, currency: string): string {
  const amount = parseFloat(price);
  if (Number.isNaN(amount) || amount <= 0) return 'Free';
  return `${currency} ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function BrowseCoursesPage() {
  const token = await getPortalToken();
  if (!token) redirect('/login');

  const result = await getCourses();

  if (result.status === 'error') {
    return (
      <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans flex items-center justify-center px-6">
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
          <ExclamationTriangleIcon className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="text-lg font-bold text-white">We couldn&apos;t load the course catalog</h1>
          <p className="text-sm text-gray-400">
            Your session is fine — the backend just didn&apos;t respond. Please try again in a moment.
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
          >
            Retry
          </Link>
        </div>
      </main>
    );
  }

  const { courses } = result;

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

      <div className="container mx-auto px-6 py-10 space-y-8">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition mb-3">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Browse Courses</h1>
          <p className="text-sm text-gray-400 mt-1">Explore the full CyberGOAT catalog and enroll when you&apos;re ready.</p>
        </div>

        {courses.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center text-sm text-gray-400">
            No courses are available right now — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isFree = parseFloat(course.price) <= 0;
              return (
                <div key={course.id} className="p-6 rounded-2xl bg-[#05080F] border border-white/10 flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <h2 className="font-bold text-white leading-snug">{course.title}</h2>
                    {course.vendor && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <BuildingLibraryIcon className="w-3.5 h-3.5 shrink-0" />
                        {course.vendor}
                        {course.certification_code ? ` · ${course.certification_code}` : ''}
                      </p>
                    )}
                  </div>

                  {course.description && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{course.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {course.level && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-gray-300">
                        <ChartBarIcon className="w-3.5 h-3.5" /> {capitalize(course.level)}
                      </span>
                    )}
                    {course.hours !== null && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-gray-300">
                        <ClockIcon className="w-3.5 h-3.5" /> {course.hours} hrs
                      </span>
                    )}
                    {course.is_official_voucher_included && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/5 border-white/10 text-gray-300">
                        <Square3Stack3DIcon className="w-3.5 h-3.5" /> Voucher Included
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                    <p className="text-xl font-extrabold text-white">
                      {formatPrice(course.price, course.currency)}
                    </p>

                    {isFree ? (
                      <EnrollFreeButton slug={course.slug} />
                    ) : (
                      <Link
                        href={`/dashboard/checkout/${course.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#2F57EF] text-white text-xs font-bold hover:bg-[#2F57EF]/80 transition"
                      >
                        <CreditCardIcon className="w-4 h-4" /> Enroll &amp; Pay
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
