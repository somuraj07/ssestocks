"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // ✅ Fetch user session to check role
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role?.toUpperCase();

      if (role === "ADMIN") {
        router.push("/itemcreate");
      } else if (role === "USER") {
        router.push("/takeitem");
      } else {
        router.push("/,"); // fallback
      }
    } catch (err) {
      console.error("Error fetching session:", err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c0c0c] via-[#101010] to-[#1a1a1a] text-gray-200 px-4">
      <div className="bg-[#181818]/90 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-sm md:max-w-md">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-100">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2.5 rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2.5 rounded-md bg-[#0f0f0f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2.5 rounded-md text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} Inventory System
        </p>
      </div>
    </div>
  );
}
