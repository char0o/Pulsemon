"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthRedirectProps = {
  redirectTo: string;
};

export default function AuthRedirect({
  redirectTo,
}: AuthRedirectProps) {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_URL}/auth`, { credentials: "include" });
        if (!res.ok) {
          router.replace(redirectTo);
        }
      } catch (err) {
        
      }
    }

    checkAuth();
  }, [API_URL, redirectTo, router]);

  return null;
}
