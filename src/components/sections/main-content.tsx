"use client";

import { useEffect, useState } from "react";
import LeftNavigation from "./left-navigation";
import CenterHeadModel from "./center-head-model";
import TopHeader from "./top-header";
import RightSystemStatus from "./right-system-status";
import BottomCoordinates from "./bottom-coordinates";
import SocialLinks from "./social-links";

export default function MainContent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-10 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top Header */}
      <TopHeader />
      
      {/* Left Navigation Menu */}
      <LeftNavigation />
      
      {/* Center 3D Head Model */}
      <CenterHeadModel />
      
      {/* Right System Status */}
      <RightSystemStatus />
      
      {/* Bottom Coordinates */}
      <BottomCoordinates />
      
      {/* Social Links - Right Side */}
      <SocialLinks />
    </div>
  );
}