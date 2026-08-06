import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeftIcon, BookOpenIcon, ClockIcon, ExclamationTriangleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';
import LogoutButton from '@/app/dashboard/LogoutButton';
import LessonBody from './LessonBody';
import VideoDownloadButton from './VideoDownloadButton';

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  type: string;
  body: string | null;
  diagram_mermaid: string | null;
  duration_minutes: number | null;
  order: number;
}

interface Module {
  id: number;
  course_id: number;
  title: string;
  order: number;
  ai_summary: string | null;
  exam_domain: string | null;
  exam_weight_percent: number | null;
  lessons: Lesson[];
}

type ModulesResult =
  | { status: 'ok'; modules: Module[]; forbidden: false }
  | { status: 'ok'; modules: []; forbidden: true }
  | { status: 'unauthenticated' }
  | { status: 'not_found' }
  | { status: 'error' };

async function getModules(slug: string, token: string): Promise<ModulesResult> {
  const res = await callPortalApi(`/v1/courses/${slug}/modules`, { token });
  if (res.status === 401) return { status: 'unauthenticated' };
  if (res.status === 403) return { status: 'ok', modules: [], forbidden: true };
  if (res.status === 404) return { status: 'not_found' };
  if (!res.ok) return { status: 'error' };

  const data = await res.json();
  return { status: 'ok', modules: data.data as Module[], forbidden: false };
}

async function getCourseTitle(slug: string): Promise<string> {
  const res = await callPortalApi(`/v1/courses/${slug}`);
  if (!res.ok) return slug;
  const data = await res.json();
  return data?.data?.title ?? slug;
}

export default async function CourseLessonsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await getPortalToken();
  if (!token) redirect('/login');

  const result = await getModules(slug, token);
  if (result.status === 'unauthenticated') redirect('/login');
  if (result.status === 'not_found') notFound();

  if (result.status === 'error') {
    return (
      <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans flex items-center justify-center px-6">
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
          <ExclamationTriangleIcon className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="text-lg font-bold text-white">We couldn&apos;t load these lessons</h1>
          <p className="text-sm text-gray-400">
            Your session is fine — the backend just didn&apos;t respond. Please try again in a moment.
          </p>
          <Link
            href={`/dashboard/courses/${slug}/lessons`}
            className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
          >
            Retry
          </Link>
        </div>
      </main>
    );
  }

  const courseTitle = await getCourseTitle(slug);
  const { modules, forbidden } = result;

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{courseTitle}</h1>
          <p className="text-sm text-gray-400 mt-1">Course lessons and study material.</p>
        </div>

        {forbidden ? (
          <div className="p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center text-sm text-gray-400">
            An active enrollment is required to view this course&apos;s lessons.
          </div>
        ) : modules.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center text-sm text-gray-400">
            Lessons for this course haven&apos;t been published yet — check back soon.
          </div>
        ) : (
          <div className="space-y-6">
            {modules.map((module) => (
              <div key={module.id} className="rounded-2xl bg-[#05080F] border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <BookOpenIcon className="w-5 h-5 text-[#0DCAF0] shrink-0" /> {module.title}
                    </h2>
                    {module.exam_weight_percent !== null && (
                      <span className="shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[#2F57EF]/20 text-[#0DCAF0] border-[#2F57EF]/30">
                        {module.exam_weight_percent}% of exam
                      </span>
                    )}
                  </div>
                  {module.exam_domain && <p className="text-xs text-gray-500">{module.exam_domain}</p>}
                  {module.ai_summary && <p className="text-sm text-gray-400">{module.ai_summary}</p>}
                </div>

                <div className="divide-y divide-white/5">
                  {module.lessons
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <div key={lesson.id} className="p-6 space-y-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            {lesson.type === 'video' ? (
                              <VideoCameraIcon className="w-4 h-4 text-[#C664FF] shrink-0" />
                            ) : (
                              <BookOpenIcon className="w-4 h-4 text-[#0DCAF0] shrink-0" />
                            )}
                            {lesson.title}
                          </h3>
                          {lesson.duration_minutes !== null && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                              <ClockIcon className="w-3.5 h-3.5" /> {lesson.duration_minutes} min
                            </span>
                          )}
                        </div>

                        {lesson.type === 'video' ? (
                          <VideoDownloadButton lessonId={lesson.id} />
                        ) : (
                          lesson.body && <LessonBody body={lesson.body} diagramMermaid={lesson.diagram_mermaid} />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
