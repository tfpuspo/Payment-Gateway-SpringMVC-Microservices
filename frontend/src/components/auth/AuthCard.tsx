import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";

type Tab = "login" | "register";

interface AuthCardProps {
  /** Called after a successful login or registration. */
  onSuccess?: () => void;
}

export function AuthCard({ onSuccess }: AuthCardProps) {
  const { login, register, status, error } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isLoading = status === "loading";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onSuccess?.();
    } catch {
      // error is already surfaced via `error` from useAuth
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl">
      {/* Tabs */}
      <div className="mb-6 grid grid-cols-2 rounded-xl bg-neutral-900 p-1">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
            tab === "login"
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
            tab === "register"
              ? "bg-neutral-800 text-white"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "register" && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-neutral-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-neutral-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-neutral-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-neutral-600"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-neutral-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Please wait…" : tab === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
