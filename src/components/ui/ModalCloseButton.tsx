"use client";

import React from "react";

type ModalCloseButtonProps = {
  onClose: () => void;
  className?: string;
};

export default function ModalCloseButton({ onClose, className }: ModalCloseButtonProps) {
  return (
    <button
      aria-label="Close"
      onClick={onClose}
      className={
        [
          // Position: anchor to the modal's top-left and nudge outward to match red-box
          "absolute top-0 left-0 -translate-x-6 -translate-y-6",
          // Shape & visual
          "glass-button w-8 h-8 flex items-center justify-center",
          "border border-white/30 rounded-sm",
          // Color & interactions
          "text-white/70 hover:text-white hover:bg-white/5",
          "transition-all duration-300",
          // Ensure it's above modal content
          "z-50",
          className || "",
        ].join(" ")
      }
    >
      ✕
    </button>
  );
}

