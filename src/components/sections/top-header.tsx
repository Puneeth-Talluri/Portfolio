"use client";

export default function TopHeader() {
  return (
    <div className="fixed top-8 left-8 z-20">
      <div className="space-y-1">
        <h1 className="relative font-mono text-lg uppercase tracking-[0.3em] leading-tight">
          <span className="aurora-fill">PUNEETH TALLURI</span>
          <span className="aurora-glow" aria-hidden="true">PUNEETH TALLURI</span>
        </h1>
        <p className="text-white/60 font-mono text-xs uppercase tracking-[0.25em]">
          SOFTWARE ENGINEER
        </p>
      </div>
    </div>
  );
}
