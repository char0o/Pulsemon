"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotAuthRedirect from "@/components/NotAuthRedirect";

type Organization = {
  id: string;
  name: string;
};

export default function NoOrganizationPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <NotAuthRedirect redirectTo="/login" />

      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          {"You're not part of any organization"}
        </h1>
        <p className="text-gray-500 mb-6">
          You can either wait until someone invites you to an organization, or
          create a new one.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/organization/create"
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            Create Organization
          </Link>
        </div>
      </div>
    </div>
  );
}
