"use client";

import { useState } from "react";
import { useTypingAnimation } from "@/hooks/use-typing-animation";
import ModalCloseButton from "@/components/ui/ModalCloseButton";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const heading = useTypingAnimation("CONTACT", 50, 0);
  const contactInfo = useTypingAnimation(
    "Feel free to reach out for collaborations, opportunities, or just to connect. I'm always open to discussing new projects and ideas.",
    10,
    heading.isComplete ? 200 : 99999
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // You can add actual form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-full max-w-4xl h-[80vh] bg-black/30 backdrop-blur-sm border border-white/30 p-8 overflow-hidden pointer-events-auto">
        {/* Close Button */}
        <ModalCloseButton onClose={onClose} />

        {/* Title */}
        <div className="mb-8 pl-16">
          <h2 className="text-white font-mono text-2xl uppercase tracking-[0.3em]">
            {heading.displayedText}
            {!heading.isComplete && <span className="animate-pulse">|</span>}
          </h2>
          <p className="text-white/60 font-mono text-xs mt-4 leading-relaxed">
            {contactInfo.displayedText}
            {!contactInfo.isComplete && <span className="animate-pulse">|</span>}
          </p>
        </div>

        {/* Content Container */}
        <div className="flex gap-8 h-[calc(100%-140px)]">
          {/* Left Side - Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-white/60 font-mono text-xs uppercase tracking-[0.2em] mb-2">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/30 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-white/60 font-mono text-xs uppercase tracking-[0.2em] mb-2">
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-white/30 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-white/60 font-mono text-xs uppercase tracking-[0.2em] mb-2">
                  YOUR MESSAGE
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-transparent border border-white/30 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                  placeholder="Enter your message"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="glass-button px-8 py-3 bg-transparent border border-white/60 text-white font-mono text-sm uppercase tracking-[0.25em] hover:bg-white/5 hover:border-cyan-400 transition-all duration-300"
              >
                >>> SEND
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          <div className="w-1/3 flex-shrink-0 space-y-8">
            <div className="border border-white/20 p-6">
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-6">
                CONTACT INFO
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-1">
                    EMAIL
                  </p>
                  <p className="text-white/80 font-mono text-xs">
                    puneethtalluri05@gmail.com
                  </p>
                </div>

                {/* <div>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-1">
                    PHONE
                  </p>
                  <p className="text-white/80 font-mono text-xs">
                    (773) 969-0061
                  </p>
                </div> */}

                <div>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-1">
                    LOCATION
                  </p>
                  <p className="text-white/80 font-mono text-xs">
                    Chicago, Illinois
                  </p>
                </div>

                <div>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-wider mb-1">
                    WEBSITE
                  </p>
                  <a 
                    href="https://puneethtalluri.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 font-mono text-xs hover:text-cyan-300 transition-colors"
                  >
                    puneethtalluri.com
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-white/20 p-6">
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                SOCIAL LINKS
              </h3>
              
              <div className="space-y-3">
                <a 
                  href="https://github.com/puneethtalluri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-white/60 font-mono text-xs hover:text-white transition-colors"
                >
                  > GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/puneeth-talluri" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-white/60 font-mono text-xs hover:text-white transition-colors"
                >
                  > LinkedIn
                </a>
              </div>
            </div>
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
