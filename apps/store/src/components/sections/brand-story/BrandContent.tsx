import Link from "next/link";

import { Button } from "../../ui/button";
import { H2, Lead } from "../../ui/typography";

type Props = {
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export function BrandContent({ eyebrow, title, text, ctaLabel }: Props) {
  return (
    <div className="space-y-8">
      {eyebrow && (
        <span className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          {eyebrow}
        </span>
      )}

      {title && <H2>{title}</H2>}

      {text && <Lead>{text}</Lead>}

      {ctaLabel && (
        <Button size="lg" asChild>
          <Link href="/about">{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
