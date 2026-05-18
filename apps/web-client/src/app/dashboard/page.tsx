"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { session } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import type { Me } from "@/lib/types";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!session.isAuthenticated) {
      router.push("/login");
      return;
    }

    apiGet<Me>("/auth/me")
      .then((data) => {
        if (data.role === "worker") {
          router.replace("/dashboard/worker");
        } else {
          router.replace("/dashboard/client");
        }
      })
      .catch(() => router.push("/login"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-[15px] text-[#6B7280]">Loading dashboard...</div>
      </div>
    </div>
  );
}
