import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "../lib/authApi";
import type { AuthPayload, AuthUser } from "../types/auth.types";

const REFRESH_TOKEN_KEY = "pg_refresh_token";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    () => localStorage.getItem(REFRESH_TOKEN_KEY)
  );
  const [status, setStatus] = useState<AuthContextValue["status"]>("idle");
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback((payload: AuthPayload) => {
    setUser(payload.user);
    setAccessToken(payload.accessToken);
    setRefreshTokenValue(payload.refreshToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  }, []);

  // On first load, if we have a stored refresh token, silently exchange it
  // for a fresh access token so the user doesn't have to log in again.
  useEffect(() => {
    if (!refreshTokenValue) return;
    setStatus("loading");
    authApi
      .refreshToken(refreshTokenValue)
      .then((payload) => {
        persist(payload);
        setStatus("authenticated");
      })
      .catch(() => {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setRefreshTokenValue(null);
        setStatus("idle");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setStatus("loading");
    setError(null);
    try {
      const payload = await authApi.login(email, password);
      persist(payload);
      setStatus("authenticated");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    }
  }, [persist]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setStatus("loading");
    setError(null);
    try {
      const payload = await authApi.register(email, password, name);
      persist(payload);
      setStatus("authenticated");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    }
  }, [persist]);

  const logout = useCallback(async () => {
    if (refreshTokenValue) {
      try {
        await authApi.logout(refreshTokenValue);
      } catch {
        // best-effort — clear local state regardless
      }
    }
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setAccessToken(null);
    setRefreshTokenValue(null);
    setStatus("idle");
  }, [refreshTokenValue]);

  const value = useMemo(
    () => ({ user, accessToken, status, error, login, register, logout }),
    [user, accessToken, status, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
