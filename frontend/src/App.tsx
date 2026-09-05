import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { AuthCard } from "./components/auth/AuthCard";
import { PaymentCheckout } from "./components/payment/PaymentCheckout";

export default function App() {
  const { user, logout } = useAuth();
  const [otpSentRef, setOtpSentRef] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-4 py-10">
      {!user ? (
        <AuthCard />
      ) : (
        <>
          <div className="flex w-full max-w-sm items-center justify-between text-sm text-neutral-400">
            <span>Signed in as {user.name}</span>
            <button onClick={logout} className="text-neutral-300 underline hover:text-white">
              Log out
            </button>
          </div>

          <PaymentCheckout totalBill={4800} onOtpSent={setOtpSentRef} />

          {otpSentRef && (
            <p className="text-sm text-neutral-400">OTP sent — reference: {otpSentRef}</p>
          )}
        </>
      )}
    </div>
  );
}
