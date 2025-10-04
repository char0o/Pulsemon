"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type NotAuthRedirectProps = {
  redirectTo: string;
};

export default function NotAuthRedirect({ redirectTo }: NotAuthRedirectProps) {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_URL}/auth`, { credentials: "include" });
        if (!res.ok) {
          router.replace(redirectTo);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Unknown error happened");
        }
      }
    }

    checkAuth();
  }, [API_URL, redirectTo, router]);

  return null;
}
