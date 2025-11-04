"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: ("ADMIN" | "USER")[];
}

export default function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (!data?.user) {
          router.push("/unauthorized");
          return;
        }

        const userRole = data.user.role?.toUpperCase();
        if (!allowedRoles.includes(userRole)) {
          router.push("/unauthorized");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Error checking role:", error);
        signOut(); // optional: force logout if session invalid
        router.push("/unauthorized");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [allowedRoles, router]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return <>{children}</>;
}
