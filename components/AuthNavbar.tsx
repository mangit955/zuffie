"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Loggedin_Navbar from "./loggedin_Navbar";
import Lottie from "lottie-react";
import loader from "@/public/lottie/loader.json";
import { createSupabaseClient } from "@/lib/supabaseClient";

const supabase = createSupabaseClient();
export function AuthNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }
      setAuthLoading(false);
    };
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Lottie animationData={loader} loop className="h-64 w-64" />
      </div>
    );
  }
  if (!user) {
    return <Navbar />;
  }
  return <Loggedin_Navbar />;
}
