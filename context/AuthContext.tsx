"use client";

import { createContext, useContext, ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";

// ✅ Define AppUser type directly instead of extending Session["user"]
type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "ADMIN" | "USER";
};

// ✅ Context shape
interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
}

// ✅ Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Internal provider that consumes next-auth
function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value: AuthContextType = {
    user: session?.user as AppUser ?? null,
    loading: status === "loading",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Exported provider for layout.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

// ✅ Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return context;
}
