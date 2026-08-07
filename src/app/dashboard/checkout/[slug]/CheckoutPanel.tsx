'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BanknotesIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

type OfflineMethod = 'bank_transfer' | 'aani_qr';

interface OfflineResult {
  invoice_number: string;
  amount_due: string | number;
  currency: string;
  payment_instructions: Record<string, unknown> | string;
}

function formatMoney(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function PaymentInstructions({ instructions }: { instructions: OfflineResult['payment_instructions'] }) {
  if (typeof instructions === 'string') {
    return <p className="text-sm text-gray-300 whitespace-pre-line">{instructions}</p>;
  }

  const entries = Object.entries(instructions ?? {}).filter(([, value]) => value !== null && value !== '');

  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">Payment instructions will be sent to your email shortly.</p>;
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => {
        if (key.toLowerCase().includes('image_url') && typeof value === 'string') {
          return (
            <div key={key} className="pt-1">
              <Image src={value} alt="QR code" width={180} height={180} className="rounded-xl border border-white/10" unoptimized />
            </div>
          );
        }
        return (
          <div key={key} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-500">{formatLabel(key)}</span>
            <span className="text-white font-mono text-right">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPanel({ slug, price, currency }: { slug: string; price: number; currency: string }) {
  const [couponInput, setCouponInput] = useState('');
  const [couponState, setCouponState] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [couponMessage, setCouponMessage] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [newTotal, setNewTotal] = useState<number | null>(null);

  const [cardState, setCardState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [cardError, setCardError] = useState('');

  const [offlineMethod, setOfflineMethod] = useState<OfflineMethod | null>(null);
  const [offlineState, setOfflineState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [offlineError, setOfflineError] = useState('');
  const [offlineResult, setOfflineResult] = useState<OfflineResult | null>(null);

  const displayedTotal = newTotal !== null ? newTotal : price;

  async function handleValidateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponState('loading');
    setCouponMessage('');
    try {
      const res = await fetch(`/api/portal/courses/${slug}/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'This coupon code is invalid, expired, or fully redeemed.');

      setCouponState('valid');
      setAppliedCode(data.code);
      setDiscountAmount(Number(data.discount_amount));
      setNewTotal(Number(data.new_total_before_vat));
      setCouponMessage(`Coupon "${data.code}" applied.`);
    } catch (err) {
      setCouponState('invalid');
      setAppliedCode(null);
      setDiscountAmount(null);
      setNewTotal(null);
      setCouponMessage(err instanceof Error ? err.message : 'This coupon code is invalid, expired, or fully redeemed.');
    }
  }

  async function handlePayWithCard() {
    setCardState('loading');
    setCardError('');
    try {
      const res = await fetch(`/api/portal/courses/${slug}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appliedCode ? { coupon_code: appliedCode } : {}),
      });
      const data = await res.json();
      if (!res.ok || !data.checkout_url) throw new Error(data?.message || 'Could not start checkout. Please try again.');
      window.location.href = data.checkout_url;
    } catch (err) {
      setCardError(err instanceof Error ? err.message : 'Could not start checkout. Please try again.');
      setCardState('error');
    }
  }

  async function handleOfflineCheckout(method: OfflineMethod) {
    setOfflineMethod(method);
    setOfflineState('loading');
    setOfflineError('');
    try {
      const res = await fetch(`/api/portal/courses/${slug}/checkout/offline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: method, ...(appliedCode ? { coupon_code: appliedCode } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Could not start offline checkout. Please try again.');
      setOfflineResult(data);
      setOfflineState('success');
    } catch (err) {
      setOfflineError(err instanceof Error ? err.message : 'Could not start offline checkout. Please try again.');
      setOfflineState('error');
    }
  }

  return (
    <div className="space-y-6">
      {/* Coupon */}
      <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 space-y-4">
        <h2 className="font-bold text-white flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-[#0DCAF0]" /> Coupon Code
        </h2>
        <form onSubmit={handleValidateCoupon} className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter code"
            disabled={couponState === 'loading'}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#2F57EF] transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={couponState === 'loading' || !couponInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition disabled:opacity-50 cursor-pointer"
          >
            {couponState === 'loading' ? 'Checking…' : 'Apply'}
          </button>
        </form>
        {couponMessage && (
          <p className={`text-xs flex items-start gap-1.5 ${couponState === 'valid' ? 'text-emerald-300' : 'text-red-400'}`}>
            {couponState === 'valid' ? (
              <CheckCircleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            ) : (
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            )}
            {couponMessage}
          </p>
        )}

        <div className="pt-3 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Price</span>
            <span className={discountAmount ? 'text-gray-500 line-through' : 'text-white font-semibold'}>
              {formatMoney(price, currency)}
            </span>
          </div>
          {discountAmount !== null && discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Discount</span>
              <span className="text-emerald-300">-{formatMoney(discountAmount, currency)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-white">Total</span>
            <span className="text-xl font-extrabold text-white">{formatMoney(displayedTotal, currency)}</span>
          </div>
          <p className="text-[11px] text-gray-500">VAT (if applicable) is calculated at checkout.</p>
        </div>
      </div>

      {/* Payment methods */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Card */}
        <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 space-y-4 flex flex-col">
          <div className="space-y-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-[#0DCAF0]" /> Pay with Card
            </h3>
            <p className="text-xs text-gray-500">Secure checkout hosted by Stripe. Instant enrollment.</p>
          </div>
          <button
            onClick={handlePayWithCard}
            disabled={cardState === 'loading'}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#2F57EF] text-white text-sm font-bold hover:bg-[#2F57EF]/80 transition disabled:opacity-50 cursor-pointer"
          >
            <CreditCardIcon className="w-4 h-4" />
            {cardState === 'loading' ? 'Redirecting…' : 'Pay with Card'}
          </button>
          {cardState === 'error' && (
            <p className="text-[11px] text-red-400 flex items-start gap-1.5">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {cardError}
            </p>
          )}
        </div>

        {/* Offline */}
        <div className="p-6 rounded-2xl bg-[#05080F] border border-white/10 space-y-4 flex flex-col">
          <div className="space-y-1">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BanknotesIcon className="w-5 h-5 text-amber-400" /> Bank Transfer / Aani QR
            </h3>
            <p className="text-xs text-gray-500">Pay manually — an admin confirms your enrollment once received.</p>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOfflineCheckout('bank_transfer')}
              disabled={offlineState === 'loading'}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
            >
              <BanknotesIcon className="w-4 h-4" />
              {offlineState === 'loading' && offlineMethod === 'bank_transfer' ? 'Loading…' : 'Bank Transfer'}
            </button>
            <button
              onClick={() => handleOfflineCheckout('aani_qr')}
              disabled={offlineState === 'loading'}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
            >
              <QrCodeIcon className="w-4 h-4" />
              {offlineState === 'loading' && offlineMethod === 'aani_qr' ? 'Loading…' : 'Aani QR'}
            </button>
          </div>
          {offlineState === 'error' && (
            <p className="text-[11px] text-red-400 flex items-start gap-1.5">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {offlineError}
            </p>
          )}
        </div>
      </div>

      {/* Offline result - pending confirmation */}
      {offlineState === 'success' && offlineResult && (
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" /> Payment Pending Confirmation
          </h3>
          <p className="text-sm text-gray-400">
            Complete the payment below, then an admin will confirm receipt and activate your enrollment. Keep your
            invoice number for reference.
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Invoice Number</span>
            <span className="text-white font-mono">{offlineResult.invoice_number}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Amount Due</span>
            <span className="text-white font-bold">{formatMoney(Number(offlineResult.amount_due), offlineResult.currency)}</span>
          </div>
          <div className="pt-3 border-t border-white/10">
            <PaymentInstructions instructions={offlineResult.payment_instructions} />
          </div>
        </div>
      )}
    </div>
  );
}
