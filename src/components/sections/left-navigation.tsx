"use client";

import { useState } from "react";
import AboutModal from "./about-modal";
import CareerModal from "./career-modal";
import ExpertiseModal from "./expertise-modal";
import ContactModal from "./contact-modal";

const menuItems = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "career", label: "CAREER" },
  { id: "expertise", label: "EXPERTISE" },
  { id: "contact", label: "CONTACT" },
];

export default function LeftNavigation() {
  const [activeItem, setActiveItem] = useState("home");
  const [openModal, setOpenModal] = useState<string | null>(null);

  const handleMenuClick = (itemId: string) => {
    setActiveItem(itemId);
    if (itemId !== "home") {
      setOpenModal(itemId);
      // Trigger avatar kick when About is opened
      if (itemId === "about") {
        try {
          window.dispatchEvent(new CustomEvent("avatar:kick"));
        } catch (err) {
          // no-op if window not available
        }
      }
    } else {
      setOpenModal(null);
    }
  };

  const closeModal = () => {
    setOpenModal(null);
    setActiveItem("home");
  };

  return (
    <>
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 space-y-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`glass-button block w-full text-left px-6 py-3 font-mono text-sm uppercase tracking-[0.25em] transition-all duration-300 border border-white/30 ${
              activeItem === item.id
                ? "bg-white/10 text-white"
                : "bg-transparent text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Modals */}
      <AboutModal isOpen={openModal === "about"} onClose={closeModal} />
      <CareerModal isOpen={openModal === "career"} onClose={closeModal} />
      <ExpertiseModal isOpen={openModal === "expertise"} onClose={closeModal} />
      <ContactModal isOpen={openModal === "contact"} onClose={closeModal} />
    </>
  );
}
