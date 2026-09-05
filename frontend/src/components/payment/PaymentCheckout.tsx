import { useState } from "react";
import type { FormEvent } from "react";
import { requestOtp } from "../../lib/paymentClient";
import { PAYMENT_METHODS } from "../../types/payment.types";
import type { MobileWalletMethod, PaymentMethod } from "../../types/payment.types";

interface PaymentCheckoutProps {
  totalBill: number;
  /** Called once the OTP request succeeds, with the transaction reference. */
  onOtpSent?: (transactionRef: string) => void;
}

const WALLET_LABEL_BN: Record<MobileWalletMethod, string> = {
  bkash: "বিকাশ নাম্বার",
  nagad: "নগদ নাম্বার",
  rocket: "রকেট নাম্বার",
};

function isMobileWallet(method: PaymentMethod): method is MobileWalletMethod {
  return method === "bkash" || method === "nagad" || method === "rocket";
}

export function PaymentCheckout({ totalBill, onOtpSent }: PaymentCheckoutProps) {
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [walletNumber, setWalletNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isMobileWallet(method)) return; // card flow isn't part of this mockup

    setError(null);
    setIsSubmitting(true);
    try {
      const result = await requestOtp({ amount: totalBill, method, walletNumber });
      onOtpSent?.(result.transactionRef);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP পাঠানো যায়নি, আবার চেষ্টা করুন");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl">
      {/* Total bill */}
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-neutral-300">মোট বিল</span>
        <span className="text-2xl font-bold text-white">
          ৳ {totalBill.toLocaleString("en-US")}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Method selector */}
        <div>
          <p className="mb-2 text-sm text-neutral-300">পেমেন্ট পদ্ধতি বেছে নিন</p>
          <div className="grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
                className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                  method === option.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {isMobileWallet(method) ? (
          <div>
            <label htmlFor="walletNumber" className="mb-1.5 block text-sm text-neutral-300">
              {WALLET_LABEL_BN[method]}
            </label>
            <input
              id="walletNumber"
              type="tel"
              inputMode="numeric"
              required
              pattern="01[0-9]{9}"
              maxLength={11}
              value={walletNumber}
              onChange={(e) => setWalletNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600"
            />
          </div>
        ) : (
          <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-400">
            কার্ড দিয়ে পেমেন্ট শীঘ্রই যুক্ত হবে
          </p>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !isMobileWallet(method)}
          className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "পাঠানো হচ্ছে…" : "OTP পাঠান"}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <LockIcon />
          SSL এনক্রিপশন দ্বারা সুরক্ষিত
        </p>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-neutral-500">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
