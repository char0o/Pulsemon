"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to log out");

      router.push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-red-400 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:from-red-500 hover:to-amber-700 transition transform hover:-translate-y-0.5 hover:scale-105"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
