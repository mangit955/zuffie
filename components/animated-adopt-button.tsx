"use client";

import { useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import hoverCat from "../public/lottie/hoverCat.json";
import { Button } from "./ui/button";

export function AnimatedAdoptButton() {
  const [playing, setPlaying] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const handelMouseEnter = () => {
    // Start animation only if not already playing
    if (!playing) {
      setPlaying(true);
      lottieRef.current?.goToAndPlay(0, true);
    }
  };

  const handelComplete = () => {
    // Called when Lottie finishes one full run
    setPlaying(false);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Floating pet animation */}
      <div className="pointer-events-none absolute -top-32">
        <Lottie
          lottieRef={lottieRef}
          animationData={hoverCat}
          loop={false}
          autoPlay={false}
          onComplete={handelComplete}
          className={`h-32 w-32 transition-opacity duration-200 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <Button
        size="lg"
        className="shine-button bg-accent hover:bg-accent cursor-pointer transition-transform duration-200 hover:scale-105 "
        onMouseEnter={handelMouseEnter}
      >
        Adopt Now
      </Button>
    </div>
  );
}
