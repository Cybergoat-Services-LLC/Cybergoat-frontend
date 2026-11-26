'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChatBubbleLeftRightIcon, SparklesIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { SignInTrigger, BookDemoTrigger } from './interactive-buttons';

const WHATSAPP_CHAT_URL = 'https://wa.me/971551846786?text=Hi%20CyberGOAT,%20we%20want%20to%20inquire%20about%20the%20GRC%20Platform';

export default function NavBar() {
  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#0A0F1A]/90 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/CG White logo_.PNG"
            alt="CyberGOAT"
            width={240}
            height={80}
            priority
            className="h-12 md:h-14 w-auto object-contain logo-bright-blue transition-transform hover:scale-105"
          />
        </Link>

        {/* Central Enterprise SaaS Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300 uppercase tracking-wider">
          <a href="#platform" className="hover:text-[#00F0FF] transition-colors">
            Platform
          </a>
          <a href="#frameworks" className="hover:text-[#00F0FF] transition-colors">
            Frameworks
          </a>
          <a href="#workforce" className="hover:text-[#00F0FF] transition-colors">
            Workforce Compliance
          </a>
          <a href="#interactive-demo" className="text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors flex items-center gap-1 font-bold">
            <SparklesIcon className="w-3.5 h-3.5" /> Interactive Demo
          </a>
          <a href="#sovereignty" className="hover:text-[#00F0FF] transition-colors">
            Sovereignty
          </a>
          <Link
            href="/academy"
            className="text-[11px] font-mono normal-case px-2.5 py-1 rounded-full border border-[#C664FF]/30 bg-[#C664FF]/10 text-[#C664FF] hover:bg-[#C664FF]/20 transition-all flex items-center gap-1"
          >
            <span>Academy</span>
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
          </Link>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={WHATSAPP_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-[#00F0FF] transition-colors px-3 py-2"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            Chat
          </a>

          <BookDemoTrigger className="px-4 py-2 bg-transparent border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-bold rounded-full hover:bg-[#00F0FF]/10 transition-all cursor-pointer">
            Book Demo
          </BookDemoTrigger>

          <SignInTrigger className="px-5 py-2 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white text-xs font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(47,87,239,0.4)] cursor-pointer">
            Sign In
          </SignInTrigger>
        </div>
      </div>
    </nav>
  );
}
