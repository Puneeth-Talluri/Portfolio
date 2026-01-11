"use client";

import { useEffect, useRef, useState } from "react";

export default function BottomCoordinates() {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const wordsRef = useRef<string[]>(["41.8781° N, 87.6298° W"]);
  const letterCountRef = useRef<number>(1);
  const directionRef = useRef<number>(1); // 1 = typing, -1 = deleting
  const waitingRef = useRef<boolean>(false);

  useEffect(() => {
    const typingInterval = window.setInterval(() => {
      const word = wordsRef.current[0];

      if (letterCountRef.current === 0 && waitingRef.current === false) {
        waitingRef.current = true;
        setText(word.substring(0, letterCountRef.current));
        window.setTimeout(() => {
          directionRef.current = 1;
          letterCountRef.current += directionRef.current;
          waitingRef.current = false;
        }, 1000);
      } else if (
        letterCountRef.current === word.length + 1 &&
        waitingRef.current === false
      ) {
        waitingRef.current = true;
        window.setTimeout(() => {
          directionRef.current = -1;
          letterCountRef.current += directionRef.current;
          waitingRef.current = false;
        }, 1000);
      } else if (waitingRef.current === false) {
        setText(word.substring(0, letterCountRef.current));
        letterCountRef.current += directionRef.current;
      }
    }, 120);

    const cursorInterval = window.setInterval(() => {
      setCursorVisible((v) => !v);
    }, 400);

    return () => {
      window.clearInterval(typingInterval);
      window.clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="text-white/60 font-mono text-xs">{'>>>'}</span>
          <span className="text-white font-mono text-sm tracking-widest">{text}</span>
          <span
            className={`text-white font-mono text-sm transition-opacity ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            _
          </span>
        </div>
      </div>
    </div>
  );
}
