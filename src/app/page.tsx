"use client";

import { useEffect, useRef, useState } from "react";
import LoadingOverlay from "@/components/sections/loading-overlay";
import FontPreloader from "@/components/sections/font-preloader";
import MainContent from "@/components/sections/main-content";
import AnimatedBackground from "@/components/sections/animated-background";

export default function HomePage() {
  // Overlay remains until avatar dispatches 'avatar:ready'
  const [isLoaded, setIsLoaded] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onReady = () => {
      setIsLoaded(true);
      // Trigger fade-out
      setOverlayVisible(false);
      // Delay unmount to allow transition to complete
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setOverlayMounted(false);
      }, 1000);
    };
    window.addEventListener("avatar:ready", onReady as EventListener);
    return () => {
      window.removeEventListener("avatar:ready", onReady as EventListener);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <main className={`relative w-screen h-screen bg-transparent ${isLoaded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <FontPreloader />
      {/* Subtle animated gradient background */}
      <AnimatedBackground />
      
      {/* 3D background disabled to avoid overlapping objects */}

      {/* Always render the main content so the avatar can load under the overlay */}
      <MainContent />

      {/* Show matrix overlay and fade it out when ready */}
      {overlayMounted && <LoadingOverlay visible={overlayVisible} />}
    </main>
  );
}
