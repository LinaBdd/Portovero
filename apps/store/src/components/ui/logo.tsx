import Link from "next/link";
import { cn } from "../../lib/utils";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Logo({
  className,
  variant = "dark",
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "select-none text-3xl font-semibold tracking-[0.18em] transition-opacity duration-300 hover:opacity-80",
        variant === "dark" ? "text-black" : "text-white",
        className
      )}
    >
      PORTOVERO
    </Link>
  );
}