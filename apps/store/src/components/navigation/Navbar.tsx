"use client";

import { Container } from "../ui/container";

import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { NavIcons } from "./NavIcons";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-24 items-center justify-between">

          <MobileNavigation />

          <Logo />

          <DesktopNavigation />

          <NavIcons />

        </div>
      </Container>
    </header>
  );
}