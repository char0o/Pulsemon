"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingError from "@/components/FloatingError";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [token, setToken] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handlePaste = (e: React.ClipboardEvent, startIndex: number) => {
    const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (!pasteData) return;

    const newToken = [...token];
    for (let i = 0; i < pasteData.length && startIndex + i < 6; i++) {
      newToken[startIndex + i] = pasteData[i];
    }
    setToken(newToken);

    const lastIndex = Math.min(startIndex + pasteData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedToken = token.join("");
    if (joinedToken.length !== 6) {
      setError("Token must be 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${API_URL}/auth/verify-auth-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: joinedToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid token");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Verify Email
        </h1>

        <p className="text-gray-500 mb-4 text-center">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <FloatingError message={error} onClose={() => setError("")} />
        )}

        {/* 6-digit token inputs */}
        <div className="flex justify-between mb-6">
          {token.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-center text-xl border-2 text-gray-500 border-indigo-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={(e) => handlePaste(e, idx)}
              ref={(el) => (inputRefs.current[idx] = el)}
            />
          ))}
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
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
