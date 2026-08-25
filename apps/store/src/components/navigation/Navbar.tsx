"use client";

import { useEffect, useState } from "react";

import { Container } from "../ui/container";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { NavIcons } from "./NavIcons";
import { Logo } from "./Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all duration-500
        ${
          scrolled
            ? "bg-[#F7F3EC]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(23,43,58,0.06)]"
            : "bg-[#F7F3EC]/70 backdrop-blur-[2px]"
        }
      `}
    >
      <Container>
        <div
          className={`
            flex items-center justify-between
            border-b
            transition-all duration-500
            ${
              scrolled
                ? "h-[70px] border-[#172B3A]/10"
                : "h-[78px] border-transparent"
            }
          `}
        >
          {/* Mobile menu */}
          <div className="lg:hidden">
            <MobileNavigation />
          </div>

          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <DesktopNavigation />
          </div>

          {/* Icons */}
          <NavIcons />
        </div>
      </Container>
    </header>
  );
}