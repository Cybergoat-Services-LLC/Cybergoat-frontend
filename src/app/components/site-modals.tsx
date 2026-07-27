'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import SignInModal from './SignInModal';
import ContactModal from './ContactModal';
import SkillAssessmentModal from './SkillAssessmentModal';
import TrackDetailModal from './TrackDetailModal';

type ModalsContextType = {
  openSignIn: () => void;
  openContact: () => void;
  openAssessment: () => void;
  openTrackDetail: (stageKey: string) => void;
  courseQuery: string;
  setCourseQuery: (q: string) => void;
};

const ModalsContext = createContext<ModalsContextType | null>(null);

export function useModals() {
  const ctx = useContext(ModalsContext);
  if (!ctx) throw new Error('useModals must be used within ModalsProvider');
  return ctx;
}

export function ModalsProvider({ children }: { children: ReactNode }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [courseQuery, setCourseQuery] = useState('');

  return (
    <ModalsContext.Provider
      value={{
        openSignIn: () => setSignInOpen(true),
        openContact: () => setContactOpen(true),
        openAssessment: () => setAssessmentOpen(true),
        openTrackDetail: (stageKey: string) => setSelectedTrack(stageKey),
        courseQuery,
        setCourseQuery,
      }}
    >
      {children}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <SkillAssessmentModal isOpen={assessmentOpen} onClose={() => setAssessmentOpen(false)} />
      <TrackDetailModal stageKey={selectedTrack} onClose={() => setSelectedTrack(null)} />
    </ModalsContext.Provider>
  );
}
