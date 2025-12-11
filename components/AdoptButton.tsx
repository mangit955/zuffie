"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/lottie/loader.json";
import { Button } from "@/components/ui/button";

export default function AdoptButton({ adoptUrl = "/adopt" }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  const onClick = async () => {
    setChecking(true);

    // Get current session quickly
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Auth check failed:", error);
      setChecking(false);
      return;
    }

    if (!session) {
      // Not signed in — show loader then redirect to login (or open modal)
      // Keep user on current page (no flash). Option A: redirect to login
      // Option B: open inline login modal — nicer UX
      router.push(`/login?redirectTo=${encodeURIComponent(adoptUrl)}`);
      // don't setChecking(false); user will navigate away
    } else {
      // Signed in — go to adopt page
      router.push(adoptUrl);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center">
        <Lottie animationData={loaderAnimation} loop className="w-28 h-28" />
      </div>
    );
  }

  return (
    <Button onClick={onClick} size="lg">
      Adopt me
    </Button>
  );
}
