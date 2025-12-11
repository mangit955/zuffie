"use client";

import { useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import hoverCat from "../public/lottie/hoverCat.json";
import loader from "../public/lottie/loader.json";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabaseClient";

export function AnimatedAdoptButton() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const router = useRouter();
  const supabase = createSupabaseClient(); // create inside component

  const handleMouseEnter = () => {
    if (!playing) {
      setPlaying(true);
      lottieRef.current?.goToAndPlay(0, true);
    }
  };

  const handleComplete = () => {
    setPlaying(false);
  };

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session ?? null;

      if (session) {
        router.push("/pets");
        return;
      }
      // if no error, browser should redirect — don't clear loading
    } catch (err) {
      console.error("Auth check failed:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center justify-center w-auto">
        <div className="w-12 h-12">
          <Lottie animationData={loader} loop />
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Floating pet animation */}
      <div className="pointer-events-none absolute -top-32">
        <Lottie
          lottieRef={lottieRef}
          animationData={hoverCat}
          loop={false}
          autoPlay={false}
          onComplete={handleComplete}
          className={`h-32 w-32 transition-opacity duration-200 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <Button
        type="button"
        size="lg"
        className="shine-button bg-accent shadow-md hover:bg-accent cursor-pointer transition-transform duration-200 hover:scale-105 "
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        aria-busy={loading}
      >
        Adopt Now
      </Button>
    </div>
  );
}
