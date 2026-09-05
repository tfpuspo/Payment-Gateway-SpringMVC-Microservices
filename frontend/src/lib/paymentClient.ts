import type { OtpRequestPayload, OtpRequestResult } from "../types/payment.types";

// NOTE: the provided codebase only contains auth-service — there is no
// payment-service/database for transactions yet. This client is a thin,
// swappable placeholder so the checkout UI has something real to call.
// Point it at Kong once a payment-service + route exist (e.g. /graphql/public
// or a REST route like /api/payments/otp), following the same pattern as
// src/lib/authApi.ts.
const PAYMENT_API_BASE_URL = import.meta.env.VITE_PAYMENT_API_BASE_URL ?? "http://localhost";

export async function requestOtp(payload: OtpRequestPayload): Promise<OtpRequestResult> {
  const res = await fetch(`${PAYMENT_API_BASE_URL}/api/payments/otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to send OTP (status ${res.status})`);
  }

  return res.json();
}
