"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");

    // If user is not logged in, redirect to login
    if (!username) {
      router.push("/auth/login");
    }
  }, [router]);
}
