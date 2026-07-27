'use client';

import Image from 'next/image';
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useModals } from './site-modals';
import { SignInTrigger, ContactTrigger, AssessmentTrigger } from './interactive-buttons';

const WHATSAPP_CHAT_URL = 'https://wa.me/971551846786';
const LMS_URL = 'https://lms.cybergoat.ae/login';

export default function NavBar() {
  const { courseQuery, setCourseQuery } = useModals();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#0A0F1A]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center shrink-0">
          <Image 
            src="/CG White logo_.PNG" 
            alt="CyberGOAT" 
            width={320} 
            height={110} 
            priority 
            className="h-16 md:h-20 w-auto object-contain logo-bright-blue transition-transform hover:scale-105"
          />
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:flex flex-1 max-w-md items-center"
        >
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 h-4 w-4 text-gray-500" />
          <input
            type="search"
            value={courseQuery}
            onChange={(e) => setCourseQuery(e.target.value)}
            placeholder="Search courses & certifications..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#2F57EF]"
          />
        </form>

        <a
          href={WHATSAPP_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-[#0DCAF0] transition-colors shrink-0"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          Chat with us
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300 shrink-0">
          <AssessmentTrigger className="text-[#0DCAF0] hover:underline cursor-pointer flex items-center gap-1">
            Skill Assessment
          </AssessmentTrigger>
          <a
            href={LMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LMS Login
          </a>
          <ContactTrigger className="hover:text-white transition-colors">
            Contact Us
          </ContactTrigger>
        </div>

        <div className="shrink-0">
          <SignInTrigger className="px-6 py-2.5 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white text-sm font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(47,87,239,0.4)]">
            Sign In
          </SignInTrigger>
        </div>
      </div>
    </nav>
  );
}
