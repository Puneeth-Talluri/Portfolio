"use client";

import { useTypingAnimation } from "@/hooks/use-typing-animation";
import ModalCloseButton from "@/components/ui/ModalCloseButton";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const heading = useTypingAnimation("ABOUT", 50, 0);
  const subheading = useTypingAnimation("HI, I AM PUNEETH TALLURI.", 30, 200);
  const intro = useTypingAnimation(
    "I'M A SOFTWARE ENGINEER BASED IN CHICAGO, ILLINOIS.",
    15,
    500
  );
  
  const summary1 = useTypingAnimation(
    "SOFTWARE ENGINEER WITH 2.5+ YEARS OF EXPERIENCE DELIVERING SCALABLE, HIGH-PERFORMANCE WEB AND CLOUD SYSTEMS. SKILLED IN JAVA, PYTHON, JAVASCRIPT, SPRING BOOT, REACT.JS, AND AZURE, WITH EXPERTISE IN FULL-STACK MICROSERVICES, MODERN UIS, AND CI/CD PIPELINES.",
    8,
    intro.isComplete ? 0 : 3000
  );
  
  const summary2 = useTypingAnimation(
    "MICROSOFT-CERTIFIED IN DYNAMICS 365 AND POWER PLATFORM, WITH HANDS-ON EXPERIENCE IN DATA STRUCTURES, ALGORITHMS, DISTRIBUTED SYSTEMS, AUTOMATION, API TESTING, AND SYSTEM RELIABILITY. ADEPT AT AGILE COLLABORATION AND BUILDING IMPACTFUL, PRODUCTION-READY SOLUTIONS FOR GLOBAL USERS ACROSS HEALTHCARE, PUBLIC SERVICES, AND ENTERPRISE PLATFORMS.",
    8,
    summary1.isComplete ? 0 : 6000
  );

  const educationTitle = useTypingAnimation("EDUCATION", 30, summary2.isComplete ? 0 : 9000);
  const contactTitle = useTypingAnimation("CONTACT INFORMATION", 30, educationTitle.isComplete ? 0 : 10000);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Make the modal container fully transparent so the avatar remains visible behind it */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-transparent border-0 p-8 overflow-hidden pointer-events-auto">
        {/* Close Button */}
        <ModalCloseButton onClose={onClose} />

        {/* Title */}
        <div className="mb-8 pl-16">
          <h2 className="text-white font-mono text-2xl uppercase tracking-[0.3em]">
            {heading.displayedText}
            {!heading.isComplete && <span className="animate-pulse">|</span>}
          </h2>
        </div>

        {/* Content Container */}
        <div className="flex gap-8 h-[calc(100%-100px)]">
          {/* Left Side - Profile Image */}
          <div className="w-1/3 flex-shrink-0">
            <div className="w-full h-full border border-white/20 flex items-center justify-center overflow-hidden">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/my-picture-1763350447582.jpg?width=8000&height=8000&resize=contain"
                alt="Puneeth Talluri"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-4">
            <div>
              <h3 className="text-cyan-400 font-mono text-lg uppercase tracking-[0.25em] mb-4">
                {subheading.displayedText}
                {!subheading.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              <p className="text-white/80 font-mono text-sm leading-relaxed mb-4">
                {intro.displayedText}
                {!intro.isComplete && <span className="animate-pulse">|</span>}
              </p>
              <p className="text-white/60 font-mono text-xs leading-relaxed mb-6">
                {summary1.displayedText}
                {intro.isComplete && !summary1.isComplete && <span className="animate-pulse">|</span>}
              </p>
              <p className="text-white/60 font-mono text-xs leading-relaxed">
                {summary2.displayedText}
                {summary1.isComplete && !summary2.isComplete && <span className="animate-pulse">|</span>}
              </p>
            </div>

            <div className="border-t border-white/20 pt-6">
              <h4 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4">
                {educationTitle.displayedText}
                {!educationTitle.isComplete && <span className="animate-pulse">|</span>}
              </h4>
              {educationTitle.isComplete && (
                <div className="space-y-4">
                  <div>
                    <p className="text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      DEPAUL UNIVERSITY
                    </p>
                    <p className="text-white/60 font-mono text-xs mt-1">
                      MS in Computer Science, Major in Systems and Software Development
                    </p>
                    <p className="text-white/40 font-mono text-xs mt-1">
                      Jan 2023 - June 2024 | CGPA: 3.72/4.0
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/20 pt-6">
              <h4 className="text-white font-mono text-sm uppercase tracking-[0.2em] mb-4">
                {contactTitle.displayedText}
                {!contactTitle.isComplete && <span className="animate-pulse">|</span>}
              </h4>
              {contactTitle.isComplete && (
                <div className="space-y-2">
                  <p className="text-white/60 font-mono text-xs">
                    EMAIL: puneethtalluri05@gmail.com
                  </p>
                  {/* <p className="text-white/60 font-mono text-xs">
                    PHONE: (773) 969-0061
                  </p> */}
                  <p className="text-white/60 font-mono text-xs">
                    LOCATION: Chicago, Illinois
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
    
      </div>
    </div>
  );
}
