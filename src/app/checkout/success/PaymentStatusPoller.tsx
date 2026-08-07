'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface InvoiceData {
  invoice_number: string;
  payment_status: string;
  amount: string;
  currency: string;
  course: { slug: string; title: string };
}

const POLL_INTERVAL_MS = 2500;
const MAX_ATTEMPTS = 8; // ~20 seconds total

export default function PaymentStatusPoller({ invoiceNumber }: { invoiceNumber: string }) {
  const [state, setState] = useState<'polling' | 'paid' | 'timed_out' | 'error'>('polling');
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      attemptsRef.current += 1;
      try {
        const res = await fetch(`/api/portal/invoices/${invoiceNumber}`);
        if (res.status === 404) {
          if (!cancelled) setState('error');
          return;
        }
        if (!res.ok) throw new Error('lookup failed');

        const data = await res.json();
        const inv = data?.data as InvoiceData | undefined;
        if (!inv) throw new Error('malformed response');

        if (cancelled) return;
        setInvoice(inv);

        if (inv.payment_status === 'paid') {
          setState('paid');
          return;
        }

        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setState('timed_out');
          return;
        }

        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (cancelled) return;
        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setState('timed_out');
        } else {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [invoiceNumber]);

  if (state === 'polling') {
    return (
      <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
        <div className="w-10 h-10 mx-auto border-2 border-[#0DCAF0] border-t-transparent rounded-full animate-spin" />
        <h1 className="text-lg font-bold text-white">Confirming your payment…</h1>
        <p className="text-sm text-gray-400">This usually takes just a few seconds.</p>
      </div>
    );
  }

  if (state === 'paid' && invoice) {
    return (
      <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
        <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto" />
        <h1 className="text-lg font-bold text-white">Payment successful</h1>
        <p className="text-sm text-gray-400">
          You&apos;re enrolled in <span className="text-white font-semibold">{invoice.course.title}</span>. Invoice{' '}
          <span className="font-mono text-xs">{invoice.invoice_number}</span>.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (state === 'timed_out') {
    return (
      <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
        <ClockIcon className="w-10 h-10 text-amber-400 mx-auto" />
        <h1 className="text-lg font-bold text-white">Almost there</h1>
        <p className="text-sm text-gray-400">
          This can take a minute to finalize — check your dashboard shortly. Your payment has been received by Stripe.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full p-8 rounded-2xl bg-[#05080F] border border-white/10 text-center space-y-4">
      <ExclamationTriangleIcon className="w-10 h-10 text-amber-400 mx-auto" />
      <h1 className="text-lg font-bold text-white">We couldn&apos;t confirm this payment</h1>
      <p className="text-sm text-gray-400">
        We couldn&apos;t find this invoice on your account. If you were charged, check your dashboard or contact support.
      </p>
      <Link
        href="/dashboard"
        className="inline-block px-5 py-2 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
