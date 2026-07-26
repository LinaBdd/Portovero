import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Container } from "./container";

type SectionSpacing = "sm" | "md" | "lg";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: SectionSpacing;
  container?: boolean;
}

const spacingClasses: Record<SectionSpacing, string> = {
  sm: "py-16",
  md: "py-24",
  lg: "py-32",
};

export function Section({
  children,
  className,
  id,
  spacing = "md",
  container = true,
}: SectionProps) {
  const content = container ? (
    <Container>{children}</Container>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing],
        className
      )}
    >
      {content}
    </section>
  );
}