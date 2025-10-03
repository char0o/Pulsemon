"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingError from "@/components/FloatingError";
import AuthRedirect from "@/components/AuthRedirect";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Email might be already used.");
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
          Create an account
        </h1>

        <p className="text-gray-500 mb-2 text-center">
          Enter your details to receive a verification code
        </p>

        <p className="text-gray-400 text-sm mb-4 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>

        {error && (
          <FloatingError message={error} onClose={() => setError("")} />
        )}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-500 font-semibold mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl p-3 w-full placeholder-gray-500 outline-none transition text-gray-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-500 font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl p-3 w-full placeholder-gray-500 outline-none transition text-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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
