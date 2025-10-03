"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col h-screen items-center justify-center bg-gradient-to-tr px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Pulsemon
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Keep track of your API endpoints. Monitor uptime, performance, and
          receive alerts whenever something goes wrong.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition transform hover:-translate-y-0.5 hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-green-500 hover:to-teal-600 transition transform hover:-translate-y-0.5 hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Pulsemon. All rights reserved.
      </footer>
    </main>
  );
}
