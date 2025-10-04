"use client"; // 👈 needed if you're on App Router because of useEffect/useState

import LogoutButton from "@/components/LogoutButton";
import NotAuthRedirect from "@/components/NotAuthRedirect";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch(`${API_URL}/organization/membership`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch organizations");
        const data: Organization[] = await res.json();
        if (data.length === 0) {
          router.push("/no-organization");
        }
        console.log(data);
        setOrganizations(data);
        if (data.length > 0) setSelectedOrg(data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrgs();
  }, [API_URL, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NotAuthRedirect redirectTo="/login" />
      <div className="flex justify-end bg-white shadow px-6 py-4">
        <LogoutButton/>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-medium">Card 1</h2>
            <p className="text-gray-500 text-sm mt-2">
              Some dashboard content.
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-medium">Card 2</h2>
            <p className="text-gray-500 text-sm mt-2">More content here.</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-medium">Card 3</h2>
            <p className="text-gray-500 text-sm mt-2">
              Organization: {selectedOrg?.name || "none"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
