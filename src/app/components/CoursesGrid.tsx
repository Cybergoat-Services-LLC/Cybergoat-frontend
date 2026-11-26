'use client';

import Image from 'next/image';
import { useState, useMemo, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ClockIcon, 
  AcademicCapIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useModals } from './site-modals';
import { BookDemoTrigger } from './interactive-buttons';
import { CourseItem, CERTIFICATIONS } from './courses-data';

function CourseCard({ item }: { item: CourseItem }) {
  return (
    <div className="group relative bg-[#05080F] border border-white/10 rounded-3xl overflow-hidden hover:border-[#00F0FF]/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between glass-card">
      <div>
        <div className="relative h-48 w-full bg-[#0A0F1A] overflow-hidden shrink-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080F] via-[#05080F]/30 to-transparent pointer-events-none" />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2F57EF]/70 text-white backdrop-blur-md border border-[#2F57EF]/40 shadow-md">
              {item.tag}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00F0FF]/20 text-[#00F0FF] backdrop-blur-md border border-[#00F0FF]/30 shadow-md">
              <ShieldCheckIcon className="w-3.5 h-3.5" /> Evidence Linked
            </span>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            {item.duration && (
              <span className="inline-flex items-center gap-1 font-mono">
                <ClockIcon className="w-3.5 h-3.5 text-[#00F0FF]" /> {item.duration}
              </span>
            )}
            {item.level && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                item.level === 'Executive' ? 'bg-[#C664FF]/20 text-[#C664FF] border-[#C664FF]/30' :
                item.level === 'Advanced' ? 'bg-[#2F57EF]/20 text-[#00F0FF] border-[#2F57EF]/30' :
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {item.level}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
            {item.title}
          </h3>
          
          {item.regulatoryBadge && (
            <div className="p-2 rounded-lg bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-[11px] font-mono text-[#00F0FF]">
              {item.regulatoryBadge}
            </div>
          )}

          <p className="text-gray-400 text-xs leading-relaxed min-h-[40px]">{item.description}</p>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <BookDemoTrigger className="w-full py-2.5 bg-[#00F0FF]/10 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black text-xs font-bold rounded-xl transition-all border border-[#00F0FF]/30 text-center cursor-pointer shadow-md">
          Add to Enterprise Seat Pool
        </BookDemoTrigger>
      </div>
    </div>
  );
}

export default function CoursesGrid() {
  const { courseQuery, setCourseQuery } = useModals();

  const filterItem = useCallback((item: CourseItem) => {
    // Exclude entry-level B2C courses from the enterprise homepage
    if (item.title === 'Ethical Hacking Essentials (EHE)') return false;

    const q = courseQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.regulatoryBadge && item.regulatoryBadge.toLowerCase().includes(q)) ||
      item.tag.toLowerCase().includes(q)
    );
  }, [courseQuery]);

  const filteredCerts = useMemo(() => CERTIFICATIONS.filter(filterItem), [filterItem]);

  return (
    <div>
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-10">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="search"
          value={courseQuery}
          onChange={(e) => setCourseQuery(e.target.value)}
          placeholder="Filter by regulation or role (e.g. DESC ISR, SOC, CISO)..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#00F0FF]"
        />
      </div>

      {courseQuery.trim() && (
        <div className="flex items-center justify-center gap-3 mb-8 text-sm text-gray-400">
          <span>
            {filteredCerts.length} result{filteredCerts.length === 1 ? '' : 's'} for &ldquo;{courseQuery}&rdquo;
          </span>
          <button
            onClick={() => setCourseQuery('')}
            className="flex items-center gap-1 text-[#00F0FF] hover:underline cursor-pointer"
          >
            <XMarkIcon className="h-4 w-4" /> Clear
          </button>
        </div>
      )}

      {/* Enterprise Role Pathways Grid */}
      <div className="mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-[#00F0FF]" /> Accredited Enterprise Role Pathways
            </h4>
            <p className="text-sm text-gray-400 mt-1">
              Official EC-Council curriculum, hands-on cloud iLabs, and proctored examination vouchers satisfying mandatory role competence under DESC ISR v3.1 Domain 9 and UAE IA v1.1 M3.
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400 shrink-0">
            {filteredCerts.length} Role Tracks Available
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((item) => (
            <CourseCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
