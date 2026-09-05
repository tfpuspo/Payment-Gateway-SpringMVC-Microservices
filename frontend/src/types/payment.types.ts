export type MobileWalletMethod = "bkash" | "nagad" | "rocket";
export type PaymentMethod = MobileWalletMethod | "card";

export interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: "bkash", label: "bKash" },
  { id: "nagad", label: "Nagad" },
  { id: "rocket", label: "Rocket" },
  { id: "card", label: "Card" },
];

export interface OtpRequestPayload {
  amount: number;
  method: MobileWalletMethod;
  walletNumber: string;
}

export interface OtpRequestResult {
  otpSent: boolean;
  /** Opaque reference the OTP-verification step will need. */
  transactionRef: string;
}
