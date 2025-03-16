"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard/overview");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return null;
}
