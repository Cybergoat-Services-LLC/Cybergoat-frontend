import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  DocumentCheckIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';
import LogoutButton from './LogoutButton';

export const metadata = {
  title: 'My Dashboard | CyberGOAT Services LLC',
};

interface DashboardData {
  user: { name: string; email: string };
  stats: { active_courses: number; certificates_earned: number; quiz_average: number | null };
  courses: Array<{
    course: { id: number; slug: string; title: string; vendor: string; certification_code: string | null; is_official_voucher_included: boolean };
    status: string;
    enrolled_at: string | null;
    has_downloaded_kit: boolean;
    has_quiz_attempt: boolean;
    has_certificate: boolean;
  }>;
  certificates: Array<{ certificate_number: string; title: string; course_title: string; type: string; issued_at: string | null }>;
  upcoming_live_classes: Array<{ id: number; topic: string; type: string; location_or_link: string; scheduled_at: string; duration_minutes: number; course: { title: string } }>;
}

type DashboardResult =
  | { status: 'ok'; data: DashboardData }
  | { status: 'unauthenticated' }
  | { status: 'error' };

async function getDashboard(): Promise<DashboardResult> {
  const token = await getPortalToken();
  if (!token) return { status: 'unauthenticated' };

  const res = await callPortalApi('/v1/dashboard', { token });
  if (res.status === 401) return { status: 'unauthenticated' };
  if (!res.ok) return { status: 'error' };

  return { status: 'ok', data: await res.json() };
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    completed: 'bg-[#2F57EF]/20 text-[#0DCAF0] border-[#2F57EF]/30',
    expired: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return map[status] ?? 'bg-white/10 text-gray-300 border-white/20';
}

export default async function DashboardPage() {
  const result = await getDashboard();
  if (result.status === 'unauthenticated') redirect('/login');

  if (result.status === 'error') {
    return (
      <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans flex items-center justify-center px-6">
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
          <ExclamationTriangleIcon className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="text-lg font-bold text-white">We couldn&apos;t load your dashboard</h1>
          <p className="text-sm text-gray-400">
            Your session is fine — the backend just didn&apos;t respond. Please try again in a moment.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
          >
            Retry
          </a>
        </div>
      </main>
    );
  }

  const { user, stats, courses, certificates, upcoming_live_classes } = result.data;

  return (
    <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans">
      <nav className="w-full py-6 border-b border-white/5">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/">
            <Image src="/CG White logo_.PNG" alt="CyberGOAT" width={220} height={70} priority className="h-12 w-auto object-contain logo-bright-blue" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 space-y-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-sm text-gray-400 mt-1">Here&apos;s where things stand with your training.</p>
          </div>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
          >
            <ShoppingBagIcon className="w-4 h-4" /> Browse Courses
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#2F57EF]/15">
              <AcademicCapIcon className="w-6 h-6 text-[#0DCAF0]" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{stats.active_courses}</p>
              <p className="text-xs text-gray-400">Active Courses</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/15">
              <CheckBadgeIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{stats.certificates_earned}</p>
              <p className="text-xs text-gray-400">Certificates Earned</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#C664FF]/15">
              <ChartBarIcon className="w-6 h-6 text-[#C664FF]" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{stats.quiz_average !== null ? `${stats.quiz_average}%` : '—'}</p>
              <p className="text-xs text-gray-400">Quiz Average</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Courses */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white">My Courses</h2>
            {courses.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center text-sm text-gray-400">
                You&apos;re not enrolled in any courses yet.
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((c) => (
                  <div key={c.course.id} className="p-6 rounded-2xl bg-[#05080F] border border-white/10 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">{c.course.title}</h3>
                        <p className="text-xs text-gray-500">{c.course.vendor}{c.course.certification_code ? ` · ${c.course.certification_code}` : ''}</p>
                      </div>
                      <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${c.has_downloaded_kit ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Kit Downloaded
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${c.has_quiz_attempt ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        <ChartBarIcon className="w-3.5 h-3.5" /> Quiz Attempted
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${c.has_certificate ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                        <DocumentCheckIcon className="w-3.5 h-3.5" /> Certified
                      </span>
                    </div>
                    {c.status === 'active' && (
                      <Link
                        href={`/dashboard/courses/${c.course.slug}/lessons`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0DCAF0] hover:text-white transition"
                      >
                        <AcademicCapIcon className="w-4 h-4" /> View Lessons
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-[#0DCAF0]" /> Upcoming Live Classes
              </h2>
              {upcoming_live_classes.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#05080F] border border-white/10 text-xs text-gray-500">
                  Nothing scheduled right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming_live_classes.map((lc) => (
                    <div key={lc.id} className="p-4 rounded-2xl bg-[#05080F] border border-white/10 space-y-1.5">
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <VideoCameraIcon className="w-4 h-4 text-[#0DCAF0] shrink-0" /> {lc.topic}
                      </p>
                      <p className="text-[11px] text-gray-500">{lc.course.title}</p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(lc.scheduled_at).toLocaleString('en-AE', { dateStyle: 'medium', timeStyle: 'short' })} · {lc.duration_minutes}min
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-amber-400" /> Certificates
              </h2>
              {certificates.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#05080F] border border-white/10 text-xs text-gray-500">
                  None earned yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div key={cert.certificate_number} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      <p className="text-sm font-bold text-white">{cert.title}</p>
                      <p className="text-[11px] text-gray-500">{cert.course_title}</p>
                      <p className="text-[10px] text-amber-400 font-mono">{cert.certificate_number}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
