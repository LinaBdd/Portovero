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

    const handleScroll = () => {

      setScrolled(window.scrollY > 20);

    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  return (

    <header
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-300
        ${
          scrolled
            ? "bg-white/95 backdrop-blur border-b shadow-sm"
            : "bg-transparent"
        }
      `}
    >

      <Container>

        <div className="flex h-20 items-center justify-between">

          <MobileNavigation />

          <Logo />

          <DesktopNavigation />

          <NavIcons />

        </div>

      </Container>

    </header>

  );
}