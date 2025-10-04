"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingError from "@/components/FloatingError";
import AuthRedirect from "@/components/AuthRedirect";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AuthRedirect redirectTo="/dashboard" />
      <form
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Login
        </h1>

        <p className="text-gray-500 mb-4 text-center">
          Enter your email to receive a verification code
        </p>

        <p className="text-gray-400 text-sm mb-4 text-center">
          {"Don't have an account?"}{" "}
          <Link
            href="/sign-up"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>

        {error && (
          <FloatingError message={error} onClose={() => setError("")} />
        )}

        <input
          type="email"
          placeholder="Email"
          className="border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl p-3 w-full placeholder-gray-500 mb-4 outline-none transition text-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          }`}
        >
          {loading ? "Sending..." : "Send Code"}
        </button>
      </form>
    </div>
  );
}
