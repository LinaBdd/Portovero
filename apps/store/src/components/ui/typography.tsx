import { cn } from "../../lib/utils";
import { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "font-serif text-5xl font-semibold tracking-tight lg:text-7xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "font-serif text-4xl font-semibold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "font-serif text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-lg leading-8 text-neutral-600",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Paragraph({ children, className }: TypographyProps) {
  return (
    <p
      className={cn(
        "text-base leading-7 text-neutral-700",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <span
      className={cn(
        "text-sm uppercase tracking-[0.25em] text-neutral-500",
        className
      )}
    >
      {children}
    </span>
  );
}