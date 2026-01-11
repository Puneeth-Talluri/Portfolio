"use client";

import { Github, Linkedin, Globe } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="fixed right-8 bottom-1/4 z-20 flex flex-col gap-6">
      <a
        href="https://github.com/Puneeth-Talluri"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
      >
        <Github size={18} />
      </a>
      <a
        href="https://www.linkedin.com/in/puneeth-talluri-b988ba191/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
      >
        <Linkedin size={18} />
      </a>
      
    </div>
  );
}