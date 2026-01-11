"use client";

import { useEffect, useRef } from "react";
import { useTypingAnimation } from "@/hooks/use-typing-animation";
import ModalCloseButton from "@/components/ui/ModalCloseButton";

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CareerModal({ isOpen, onClose }: CareerModalProps) {
  const heading = useTypingAnimation("CAREER", 50, 0);

  const experiences = [
    {
      period: "JAN 2025 - PRESENT",
      company: "KRASAN CONSULTING SERVICES",
      role: "SDET",
      location: "Chicago, Illinois",
      achievements: [
        "Owned resolution of 50+ production defects across CCWIS; performed root-cause debugging and deployed fixes, cutting P1 turnaround by 40% for 1,000+ daily users.",
        "Designed and built Java/Selenium UI and Postman API suites (~120 tests) with Azure DevOps PR gates; reduced QA cycle time 35% and improved CI merge stability.",
        "Led design and maintenance of automation frameworks for Dynamics 365 & Power Apps; streamlined Jira workflows, accelerating releases by 20% and boosting reliability.",
        "Implemented API tests in Postman and practiced TDD; significantly stabilized and modernized DCFS case-management services used by 1,000+ staff statewide.",
      ]
    },
    {
      period: "NOV 2021 - DEC 2022",
      company: "COGNIZANT TECHNOLOGY SERVICES",
      role: "FULL STACK DEVELOPER",
      location: "Hyderabad, India",
      achievements: [
        "Built and shipped 5+ Java/Jakarta EE web apps; wrote unit & integration tests (JUnit/Mockito) for Spring Boot APIs; delivered production features bi-weekly to global users.",
        "Refactored legacy Java apps with Spring/Hibernate; standardized releases and cut downtime by 15%.",
        "Designed RESTful APIs with Swagger/OpenAPI, improving integration clarity and reuse.",
        "Engineered AWS microservices (EC2, S3, RDS, DynamoDB) in a standardized stack; containerized with Docker, optimized CI/CD, and profiled hot paths to cut API latency 30% at scale.",
      ]
    },
    {
      period: "APR 2021 - NOV 2021",
      company: "VIHAVE.AI",
      role: "SOFTWARE INTERN",
      location: "Hyderabad, India",
      achievements: [
        "Wrote unit tests with JUnit/Mockito across modules, cutting pre-release bugs by 11%.",
        "Developed Admin Console UIs that enhanced accessibility, cut workflow steps by 20%, and improved responsiveness for daily operations.",
        "Supported SDLC for RESTful APIs; wrote requirements, specs, and acceptance criteria with the client.",
        "Built CI/CD with GitHub Actions and containerized services with Docker to accelerate deployments.",
      ]
    }
  ];

  // Sort experiences in ascending order by start date
  const monthMap: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };

  const parseStart = (period: string) => {
    // Expected format: "MMM YYYY - ..."
    const match = period.match(/^(\w{3})\s(\d{4})/);
    if (!match) return new Date(0);
    const [_, mon, year] = match;
    const m = monthMap[mon.toUpperCase()] ?? 0;
    return new Date(Number(year), m, 1);
  };

  const sortedExperiences = [...experiences].sort(
    (a, b) => parseStart(a.period).getTime() - parseStart(b.period).getTime()
  );

  // Animated line ref to ensure the draw animation plays reliably
  const pathRef = useRef<SVGPathElement>(null);
  const lineDuration = 3; // seconds
  const showDots = false; // toggle to show/hide timeline dots
  useEffect(() => {
    if (!isOpen) return;
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    // Cancel any previous animations to reset state on reopen
    if (typeof path.getAnimations === "function") {
      path.getAnimations().forEach((a) => a.cancel());
    }

    const N = sortedExperiences.length;
    const fractions = N > 1 ? sortedExperiences.map((_, i) => i / (N - 1)) : [0];
    const revealS = 0.7; // label reveal duration in seconds (matches CSS reveal-wipe)
    const moveMs = lineDuration * 1000;
    const holdMs = revealS * 1000; // pause time at each checkpoint
    const holdsCount = Math.max(0, N - 1); // pause at start and between dots except after last move
    const totalMs = moveMs + holdMs * holdsCount;

    // Build keyframes that pause the stroke at each checkpoint while labels reveal
    const kfs: Array<{ offset: number; strokeDashoffset: number }> = [];
    let t = 0;
    // Initial hold at first dot
    kfs.push({ offset: 0, strokeDashoffset: len });
    t += holdMs;
    kfs.push({ offset: t / totalMs, strokeDashoffset: len });

    for (let i = 0; i < N - 1; i++) {
      const segMs = moveMs * (fractions[i + 1] - fractions[i]);
      t += segMs;
      const dash = len * (1 - fractions[i + 1]);
      kfs.push({ offset: t / totalMs, strokeDashoffset: dash });
      // Hold at intermediate checkpoints (not needed after final)
      if (i + 1 < N - 1) {
        t += holdMs;
        kfs.push({ offset: t / totalMs, strokeDashoffset: dash });
      }
    }

    // Start the animation
    (path as any).animate(kfs, {
      duration: totalMs,
      easing: "linear",
      fill: "forwards",
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-[92vw] max-w-7xl h-[85vh] bg-black/30 backdrop-blur-sm border border-white/30 p-8 overflow-hidden pointer-events-auto">
        {/* Close Button */}
        <ModalCloseButton onClose={onClose} />

        {/* Title */}
        <div className="mb-8 pl-16">
          <h2 className="text-white font-mono text-2xl uppercase tracking-[0.3em]">
            {heading.displayedText}
            {!heading.isComplete && <span className="animate-pulse">|</span>}
          </h2>
        </div>

        {/* Timeline Container - Horizontal milestones with company + period only */}
        <div className="h-[calc(100%-100px)] pr-4">
          <div className="relative w-full h-64 px-10 md:px-16">
            {/* Subtle grid overlay to match futurist theme */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Main timeline line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/30" />

            {/* Animated connecting line (draws left → right across dots) */}
            <svg
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 w-full pointer-events-none z-10"
              viewBox="0 0 1000 8"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Aurora-like animated gradient to match name styling */}
                <linearGradient id="auroraStroke" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="1000" y2="4">
                  <stop offset="0%" stopColor="rgba(0,255,208,0.9)" />
                  <stop offset="35%" stopColor="rgba(34,211,238,0.9)" />
                  <stop offset="70%" stopColor="rgba(124,58,237,0.9)" />
                  <stop offset="100%" stopColor="rgba(0,255,208,0.9)" />
                  <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 100 0; 0 0" dur="10s" repeatCount="indefinite" />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                d="M 0 4 L 1000 4"
                stroke="url(#auroraStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              />
            </svg>

            {/* Roles above the line */}
            {sortedExperiences.map((exp, i) => {
              const percent = sortedExperiences.length > 1 ? (i / (sortedExperiences.length - 1)) * 100 : 0;
              const isFirst = i === 0;
              const isLast = i === sortedExperiences.length - 1;
              const revealS = 0.7;
              const delay = (percent / 100) * lineDuration + i * revealS;
              return (
                <div
                  key={`role-${i}`}
                  className="absolute"
                  style={{ left: `calc(${percent}% - 8px)`, top: "calc(50% - 40px)" }}
                >
                  <div
                    className={`${isFirst ? "translate-x-0 text-left" : isLast ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"}`}
                    style={{ animation: `reveal-wipe 0.7s ease forwards`, animationDelay: `${delay}s`, opacity: 0 }}
                  >
                    <p className="text-cyan-300 font-mono text-xs md:text-sm uppercase tracking-[0.2em]">
                      {exp.role}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Milestones */}
            {sortedExperiences.map((exp, i) => {
              const percent = sortedExperiences.length > 1 ? (i / (sortedExperiences.length - 1)) * 100 : 0;
              const isFirst = i === 0;
              const isLast = i === sortedExperiences.length - 1;
              const revealS = 0.7;
              const delay = (percent / 100) * lineDuration + i * revealS; // include pauses at prior checkpoints
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: `calc(${percent}% - 8px)`, top: "50%" }}
                >
                  {/* Dot (hidden when showDots is false) */}
                  <div className={showDots ? "w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.6)]" : "hidden"} />
                  {/* Label */}
                  <div className={`mt-3 ${isFirst ? "translate-x-0 text-left" : isLast ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"}`}
                       style={{ animation: `reveal-wipe 0.7s ease forwards`, animationDelay: `${delay}s`, opacity: 0 }}>
                    <h3 className="text-white font-mono text-sm md:text-base uppercase tracking-[0.2em]">
                      {exp.company}
                    </h3>
                    <p className="text-white/60 font-mono text-xs md:text-sm uppercase tracking-wider">
                      {exp.period}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Active Indicator */}
        <div className="absolute bottom-6 left-8 text-white/40 font-mono text-xs uppercase tracking-[0.2em]">
          COGNITIVE SYSTEM ACTIVE
        </div>
      </div>
    </div>
  );
}
