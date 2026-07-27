'use client';

import { ReactNode } from 'react';
import { useModals } from './site-modals';

export function SignInTrigger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openSignIn } = useModals();
  return (
    <button onClick={openSignIn} className={className}>
      {children}
    </button>
  );
}

export function ContactTrigger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openContact } = useModals();
  return (
    <button onClick={openContact} className={className}>
      {children}
    </button>
  );
}

export function AssessmentTrigger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openAssessment } = useModals();
  return (
    <button onClick={openAssessment} className={className}>
      {children}
    </button>
  );
}

export function TrackTrigger({
  stageKey,
  className,
  children,
}: {
  stageKey: string;
  className?: string;
  children: ReactNode;
}) {
  const { openTrackDetail } = useModals();
  return (
    <button onClick={() => openTrackDetail(stageKey)} className={className}>
      {children}
    </button>
  );
}
