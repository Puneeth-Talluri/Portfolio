"use client";

import { useEffect, useState } from "react";
import { useTypingAnimation } from "@/hooks/use-typing-animation";
import ModalCloseButton from "@/components/ui/ModalCloseButton";

interface ExpertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpertiseModal({ isOpen, onClose }: ExpertiseModalProps) {
  const [visibleSkills, setVisibleSkills] = useState<number>(0);
  
  // Call all hooks BEFORE any conditional returns
  const heading = useTypingAnimation("EXPERTISE", 50, 0);

  const categoryTitles = {
    languages: useTypingAnimation("Languages & Frameworks", 30, heading.isComplete ? 200 : 99999),
    webTech: useTypingAnimation("Web & UI Technologies", 30, heading.isComplete ? 400 : 99999),
    cloud: useTypingAnimation("Cloud & Platforms", 30, heading.isComplete ? 600 : 99999),
    databases: useTypingAnimation("Databases & Messaging", 30, heading.isComplete ? 800 : 99999),
    apis: useTypingAnimation("APIs & Integration", 30, heading.isComplete ? 1000 : 99999),
    automation: useTypingAnimation("Automation & Testing", 30, heading.isComplete ? 1200 : 99999),
    devops: useTypingAnimation("DevOps & Tools", 30, heading.isComplete ? 1400 : 99999),
    enterprise: useTypingAnimation("CRM & Enterprise Platforms", 30, heading.isComplete ? 1600 : 99999)
  };

  useEffect(() => {
    if (isOpen && heading.isComplete) {
      setVisibleSkills(0);
      const interval = setInterval(() => {
        setVisibleSkills((prev) => prev + 1);
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, heading.isComplete]);

  // NOW we can do the conditional return AFTER all hooks
  if (!isOpen) return null;

  const skills = {
    languages: ["Java", "Python", "JavaScript", "C++", "TypeScript", "C#"],
    frameworks: ["Spring Boot", "Node.js", "React.js", "Redux"],
    webTech: ["HTML", "CSS", "XML", "Bootstrap"],
    cloud: ["AWS", "Microsoft Azure", "Docker"],
    databases: ["MySQL", "MongoDB", "Oracle", "Kafka"],
    apis: ["REST APIs", "Swagger", "GraphQL"],
    automation: ["JUnit", "Selenium", "Postman", "Cucumber"],
    devops: ["Azure DevOps", "Git", "GitHub Actions", "Terraform", "Kubernetes", "Maven"],
    enterprise: ["Power Platform", "Dynamics 365", "Power Apps"]
  };

  const allSkills = [
    ...skills.languages,
    ...skills.frameworks,
    ...skills.webTech,
    ...skills.cloud,
    ...skills.databases,
    ...skills.apis,
    ...skills.automation,
    ...skills.devops,
    ...skills.enterprise
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative w-full max-w-6xl h-[80vh] bg-black/30 backdrop-blur-sm border border-white/30 p-8 overflow-hidden pointer-events-auto">
        {/* Close Button */}
        <ModalCloseButton onClose={onClose} />

        {/* Title */}
        <div className="mb-8 pl-16">
          <h2 className="text-white font-mono text-2xl uppercase tracking-[0.3em]">
            {heading.displayedText}
            {!heading.isComplete && <span className="animate-pulse">|</span>}
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="h-[calc(100%-150px)] overflow-y-auto pr-4">
          <div className="space-y-8">
            {/* Languages & Frameworks */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.languages.displayedText}
                {!categoryTitles.languages.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.languages.isComplete && (
                <div className="grid grid-cols-3 gap-4">
                  {[...skills.languages, ...skills.frameworks].map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Web Technologies */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.webTech.displayedText}
                {!categoryTitles.webTech.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.webTech.isComplete && (
                <div className="grid grid-cols-4 gap-4">
                  {skills.webTech.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cloud & Platforms */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.cloud.displayedText}
                {!categoryTitles.cloud.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.cloud.isComplete && (
                <div className="grid grid-cols-3 gap-4">
                  {skills.cloud.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Databases & Messaging */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.databases.displayedText}
                {!categoryTitles.databases.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.databases.isComplete && (
                <div className="grid grid-cols-4 gap-4">
                  {skills.databases.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* APIs & Integration */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.apis.displayedText}
                {!categoryTitles.apis.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.apis.isComplete && (
                <div className="grid grid-cols-3 gap-4">
                  {skills.apis.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Automation & Testing */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.automation.displayedText}
                {!categoryTitles.automation.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.automation.isComplete && (
                <div className="grid grid-cols-4 gap-4">
                  {skills.automation.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DevOps & Tools */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.devops.displayedText}
                {!categoryTitles.devops.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.devops.isComplete && (
                <div className="grid grid-cols-4 gap-4">
                  {skills.devops.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Enterprise Platforms */}
            <div>
              <h3 className="text-cyan-400 font-mono text-sm uppercase tracking-[0.25em] mb-4">
                {categoryTitles.enterprise.displayedText}
                {!categoryTitles.enterprise.isComplete && <span className="animate-pulse">|</span>}
              </h3>
              {categoryTitles.enterprise.isComplete && (
                <div className="grid grid-cols-3 gap-4">
                  {skills.enterprise.map((skill, i) => {
                    const globalIndex = allSkills.indexOf(skill);
                    const isVisible = visibleSkills > globalIndex;
                    return (
                      <div
                        key={i}
                        className={`border border-white/20 p-3 hover:border-cyan-400/50 transition-all duration-300 ${
                          isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-white font-mono text-xs uppercase tracking-wider text-center">
                          ◆ {skill}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
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
