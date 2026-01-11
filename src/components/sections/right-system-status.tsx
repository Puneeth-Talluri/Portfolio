"use client";

import { useEffect, useState } from "react";

export default function RightSystemStatus() {
  // Render time only after client mounts to avoid SSR hydration mismatch
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setTimeString(
        new Date().toLocaleTimeString("en-US", { hour12: false })
      );
    };

    // Initialize immediately on mount
    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-1/3 right-8 z-20 space-y-8">

      {/* System Time */}
      <div className="text-right space-y-1">
        <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em]">
          SYSTEM TIME
        </p>
        <p
          className="text-white/80 font-mono text-sm tracking-widest"
          suppressHydrationWarning
        >
          {timeString}
        </p>
      </div>

    </div>
  );
}
