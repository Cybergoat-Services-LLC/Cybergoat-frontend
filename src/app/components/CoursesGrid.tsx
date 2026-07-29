'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ClockIcon, 
  CheckBadgeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useModals } from './site-modals';
import { ContactTrigger } from './interactive-buttons';
import { CourseItem, TRAINING_PROGRAMS, CERTIFICATIONS } from './courses-data';

function CourseCard({ item }: { item: CourseItem }) {
  return (
    <div className="group relative bg-[#05080F] border border-white/10 rounded-3xl overflow-hidden hover:border-[#2F57EF]/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between glass-card">
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
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2F57EF]/60 text-white backdrop-blur-md border border-[#2F57EF]/40 shadow-md">
              {item.tag}
            </span>
            {item.includesVoucher && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/30 text-amber-300 backdrop-blur-md border border-amber-500/40 shadow-md">
                <CheckBadgeIcon className="w-3.5 h-3.5" /> Official Voucher
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            {item.duration && (
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5 text-[#0DCAF0]" /> {item.duration}
              </span>
            )}
            {item.level && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                item.level === 'Executive' ? 'bg-[#C664FF]/20 text-[#C664FF] border-[#C664FF]/30' :
                item.level === 'Advanced' ? 'bg-[#2F57EF]/20 text-[#0DCAF0] border-[#2F57EF]/30' :
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {item.level}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-[#0DCAF0] transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed min-h-[50px]">{item.description}</p>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <ContactTrigger className="w-full py-2.5 bg-white/5 hover:bg-[#2F57EF] text-gray-300 hover:text-white text-xs font-bold rounded-full transition-all border border-white/10 text-center">
          Inquire / Enroll
        </ContactTrigger>
      </div>
    </div>
  );
}

const CATEGORIES = ['All', 'EC-Council', 'ISACA', 'Privacy', 'Advanced', 'Fundamentals'];

export default function CoursesGrid() {
  const { courseQuery, setCourseQuery } = useModals();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filterItem = (item: CourseItem) => {
    // Search query filter
    const q = courseQuery.toLowerCase().trim();
    const matchesQuery = !q || (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    );

    // Category filter
    const matchesCategory = selectedCategory === 'All' || 
      item.category === selectedCategory ||
      item.tag.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesQuery && matchesCategory;
  };

  const filteredPrograms = useMemo(() => TRAINING_PROGRAMS.filter(filterItem), [courseQuery, selectedCategory]);
  const filteredCerts = useMemo(() => CERTIFICATIONS.filter(filterItem), [courseQuery, selectedCategory]);
  const totalResults = filteredPrograms.length + filteredCerts.length;

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white shadow-[0_0_20px_rgba(47,87,239,0.4)]'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile Search Bar */}
      <div className="relative max-w-md mx-auto mb-6 md:hidden">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="search"
          value={courseQuery}
          onChange={(e) => setCourseQuery(e.target.value)}
          placeholder="Search courses & certifications..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#2F57EF]"
        />
      </div>

      {courseQuery.trim() && (
        <div className="flex items-center justify-center gap-3 mb-8 text-sm text-gray-400">
          <span>
            {totalResults} result{totalResults === 1 ? '' : 's'} for &ldquo;{courseQuery}&rdquo;
          </span>
          <button
            onClick={() => setCourseQuery('')}
            className="flex items-center gap-1 text-[#0DCAF0] hover:underline cursor-pointer"
          >
            <XMarkIcon className="h-4 w-4" /> Clear
          </button>
        </div>
      )}

      {/* Certifications Section */}
      {filteredCerts.length > 0 && (
        <div className="mb-16">
          <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-[#0DCAF0]" /> Professional Certifications
          </h4>
          <p className="text-sm text-gray-400 mb-8">
            As an authorized EC-Council partner, we provide official training alongside official exam vouchers.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((item) => (
              <CourseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Training Programs Section */}
      {filteredPrograms.length > 0 && (
        <div className="mb-16">
          <h4 className="text-xl font-bold text-white mb-6">Custom Technical Tracks</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((item) => (
              <CourseCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      )}

      {totalResults === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">
            No matches for &ldquo;{courseQuery || selectedCategory}&rdquo; in our current catalog.
          </p>
          <ContactTrigger className="inline-block px-6 py-3 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(47,87,239,0.4)] transition-all">
            Ask Us About Custom Training
          </ContactTrigger>
        </div>
      )}
    </div>
  );
}
